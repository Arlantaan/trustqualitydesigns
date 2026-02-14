'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShakeToClick() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isSupported, setIsSupported] = useState(false);
  const lastShakeTime = useRef<number>(0);
  const shakeThreshold = 25; // Acceleration threshold for shake detection
  const shakeCooldown = 500; // Milliseconds between shake detections

  useEffect(() => {
    // Check if device has motion sensors
    const checkSupport = () => {
      const hasMotion = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Only show if it's a mobile device with motion support
      setIsSupported(hasMotion && (isMobile || hasTouchScreen));
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isEnabled || !isSupported) return;

    // Check if motion events are supported
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      // Check if iOS permission is needed
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ requires permission
        requestPermission();
      } else {
        // Android or older iOS
        setPermission('granted');
        startListening();
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isEnabled]);

  const requestPermission = async () => {
    try {
      const response = await (DeviceMotionEvent as any).requestPermission();
      setPermission(response);
      if (response === 'granted') {
        startListening();
      }
    } catch (error) {
      console.error('Motion permission failed:', error);
      setPermission('denied');
    }
  };

  const startListening = () => {
    window.addEventListener('devicemotion', handleMotion, true);
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    
    // Calculate total acceleration magnitude
    const accelerationMagnitude = Math.sqrt(
      (x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2
    );

    // Detect shake (sudden acceleration spike)
    const now = Date.now();
    if (
      accelerationMagnitude > shakeThreshold &&
      now - lastShakeTime.current > shakeCooldown
    ) {
      lastShakeTime.current = now;
      triggerShakeClick();
    }
  };

  const triggerShakeClick = () => {
    // Visual feedback
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    // Get element at center of screen (mobile) or cursor position
    let targetElement: Element | null = null;

    if ('ontouchstart' in window) {
      // Mobile: click center of screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetElement = document.elementFromPoint(centerX, centerY);
    } else {
      // Desktop: use last known cursor position (would need to track)
      // For now, just click center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetElement = document.elementFromPoint(centerX, centerY);
    }

    // Trigger click on the element
    if (targetElement && targetElement instanceof HTMLElement) {
      // Find closest clickable element (button, link, etc.)
      const clickable = targetElement.closest('a, button, [role="button"]') as HTMLElement;
      if (clickable) {
        clickable.click();
        
        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }
  };

  const toggleFeature = async () => {
    if (!isEnabled && permission === 'prompt') {
      // Request permission first
      await requestPermission();
    }
    setIsEnabled(!isEnabled);
  };

  // Don't render anything if device doesn't support motion
  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Shake Visual Feedback */}
      <AnimatePresence>
        {isShaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-red-700 opacity-80 flex items-center justify-center shadow-2xl">
              <span className="text-4xl">👆</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleFeature}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
          isEnabled
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/50'
            : 'bg-gray-800 text-gray-400 shadow-gray-900/50'
        }`}
        title={isEnabled ? 'Shake to Click: ON' : 'Shake to Click: OFF'}
      >
        {isEnabled ? '🤳' : '📱'}
      </motion.button>

      {/* Status Indicator */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-44 right-6 z-50 bg-gray-900/90 backdrop-blur text-white text-xs px-4 py-2 rounded-full shadow-lg border border-red-500/30"
          >
            <div className="flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
              Shake to click
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Denied Message */}
      <AnimatePresence>
        {permission === 'denied' && isEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 backdrop-blur text-white px-6 py-3 rounded-lg shadow-xl border border-red-500/50 max-w-xs text-center text-sm"
          >
            Motion permission denied. Enable in Settings → Safari → Motion & Orientation Access
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
