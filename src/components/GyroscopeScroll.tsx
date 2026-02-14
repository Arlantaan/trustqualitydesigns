'use client';

import { useEffect, useState } from 'react';

export function GyroscopeScroll() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Check if device has gyroscope/orientation sensors
    const checkSupport = () => {
      const hasOrientation = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Only enable on mobile devices with orientation support
      const supported = hasOrientation && (isMobile || hasTouchScreen);
      setIsSupported(supported);

      if (supported) {
        // Check if iOS permission is needed
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          setPermission('prompt');
        } else {
          // Android or older iOS - start immediately
          setPermission('granted');
          startListening();
        }
      }
    };

    checkSupport();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestPermission = async () => {
    if (permissionRequested) return;
    setPermissionRequested(true);

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        setPermission(response);
        if (response === 'granted') {
          startListening();
        }
      } catch (error) {
        console.error('Permission request failed:', error);
        setPermission('denied');
      }
    }
  };

  const startListening = () => {
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta === null) return;

    // beta: front-to-back tilt (-180 to 180)
    // When phone tilts forward (down): beta increases (positive)
    // When phone tilts backward (up): beta decreases (negative)
    
    const beta = event.beta;
    
    // Define neutral zone (when phone is held upright, around 70-90 degrees)
    const neutralAngle = 80; // Center of neutral zone
    const deadZone = 15; // Degrees of dead zone on each side
    
    // Calculate tilt from neutral position
    const tiltFromNeutral = beta - neutralAngle;
    
    // Only scroll if outside dead zone
    if (Math.abs(tiltFromNeutral) > deadZone) {
      // Calculate scroll speed based on tilt angle
      // More tilt = faster scroll
      const maxTilt = 30; // Maximum effective tilt angle
      const normalizedTilt = Math.max(-maxTilt, Math.min(maxTilt, tiltFromNeutral));
      
      // Scroll speed: 0-10 pixels per frame
      const scrollSpeed = (normalizedTilt / maxTilt) * 10;
      
      // Scroll the page
      window.scrollBy({
        top: scrollSpeed,
        behavior: 'auto' // Use 'auto' for smooth gyroscope scrolling
      });
    }
  };

  // Auto-request permission on first touch for iOS
  const handleFirstTouch = () => {
    if (permission === 'prompt') {
      requestPermission();
    }
  };

  useEffect(() => {
    if (isSupported && permission === 'prompt') {
      // Add touch listener to trigger permission request
      document.addEventListener('touchstart', handleFirstTouch, { once: true });
      return () => {
        document.removeEventListener('touchstart', handleFirstTouch);
      };
    }
  }, [isSupported, permission]);

  // This component doesn't render anything visible
  return null;
}
