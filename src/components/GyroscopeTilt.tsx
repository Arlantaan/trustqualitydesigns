'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface GyroscopeTiltProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function GyroscopeTilt({ children, intensity = 15, className = '' }: GyroscopeTiltProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [permissionRequested, setPermissionRequested] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

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
    if (event.beta === null || event.gamma === null) return;

    // beta: front-to-back tilt (-180 to 180)
    // gamma: left-to-right tilt (-90 to 90)
    
    // Normalize values to -1 to 1 range
    const beta = Math.max(-90, Math.min(90, event.beta)); // Clamp to -90 to 90
    const gamma = Math.max(-90, Math.min(90, event.gamma)); // Clamp to -90 to 90

    // Convert to percentage (-1 to 1)
    const tiltX = (gamma / 90) * intensity;
    const tiltY = (beta / 90) * intensity * -1; // Invert Y for natural feel

    setTilt({ x: tiltX, y: tiltY });
  };

  // Auto-request permission on first tap for iOS
  const handleFirstTouch = () => {
    if (permission === 'prompt') {
      requestPermission();
    }
  };

  if (!isSupported || permission === 'denied') {
    // Fallback: render normally without tilt
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={className}
      onTouchStart={handleFirstTouch}
      style={{
        transform: permission === 'granted' 
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          : 'none',
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
