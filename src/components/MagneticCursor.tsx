'use client';

import { useEffect, useState } from 'react';

// Check if device is touch-enabled BEFORE component renders
const isTouchDevice = () => {
  if (typeof window === 'undefined') return true; // Default to true on server
  
  // Only check for actual touch capability, not screen size
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  
  return hasTouch || isMobileUA || isCoarsePointer;
};

export function MagneticCursor() {
  // Return early if touch device - don't even set up state
  if (isTouchDevice()) return null;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Double-check on mount - don't set up listeners on touch devices
    if (isTouchDevice()) {
      return;
    }

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
  }, []);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      {/* Custom Cursor - DESKTOP ONLY */}
      <div
        className="hidden lg:block fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-red-500 opacity-80 blur-sm animate-pulse" />
      </div>

      {/* Trail Particles - DESKTOP ONLY */}
      {trail.map((particle, index) => (
        <div
          key={particle.id}
          className="hidden lg:block fixed pointer-events-none z-[9998]"
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
