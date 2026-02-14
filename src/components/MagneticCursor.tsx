'use client';

import { useEffect, useState } from 'react';

export function MagneticCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if it's a touch device
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsTouchDevice(hasTouch || isMobile);
    };

    checkTouchDevice();

    // Don't add event listeners if it's a touch device
    if (isTouchDevice) return;

    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Add trail particle
      const newParticle = { x: e.clientX, y: e.clientY, id: trailId++ };
      setTrail((prev) => [...prev.slice(-15), newParticle]);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-red-500 opacity-80 blur-sm animate-pulse" />
      </div>

      {/* Trail Particles */}
      {trail.map((particle, index) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: particle.x,
            top: particle.y,
            transform: 'translate(-50%, -50%)',
            opacity: (index / trail.length) * 0.5,
          }}
        >
          <div
            className="rounded-full bg-gradient-to-r from-red-500 to-red-600 blur-md"
            style={{
              width: `${4 + (index / trail.length) * 8}px`,
              height: `${4 + (index / trail.length) * 8}px`,
            }}
          />
        </div>
      ))}
    </>
  );
}
