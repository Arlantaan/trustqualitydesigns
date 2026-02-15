'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollTransitionProps {
  children: ReactNode;
  variant?: 'curtain' | 'slide' | 'zoom' | 'rotate' | 'wipe';
  intensity?: 'subtle' | 'dramatic';
}

export function ScrollTransition({
  children,
  variant = 'curtain',
  intensity = 'dramatic',
}: ScrollTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // More dramatic ranges for visible transitions
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    intensity === 'dramatic' ? [0.6, 1, 1, 1.15] : [0.9, 1, 1, 1.05]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    intensity === 'dramatic' ? [300, 0, 0, -150] : [100, 0, 0, -50]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [20, 0, 0, -15]
  );

  // Wipe effect - sliding panels
  const wipeLeft = useTransform(scrollYProgress, [0, 0.2], ['-100%', '100%']);
  const wipeRight = useTransform(scrollYProgress, [0, 0.2], ['100%', '-100%']);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* CURTAIN TRANSITION - Simplified */}
      {variant === 'curtain' && (
        <>
          {/* Top Curtain */}
          <motion.div
            className="fixed inset-x-0 top-0 h-screen z-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #dc2626 0%, #991b1b 30%, transparent 100%)',
              opacity: useTransform(scrollYProgress, [0, 0.15], [0.8, 0]),
              y: useTransform(scrollYProgress, [0, 0.15], ['0%', '-100%']),
            }}
          />
          {/* Bottom Curtain */}
          <motion.div
            className="fixed inset-x-0 bottom-0 h-screen z-40 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #dc2626 0%, #991b1b 30%, transparent 100%)',
              opacity: useTransform(scrollYProgress, [0.85, 1], [0, 0.8]),
              y: useTransform(scrollYProgress, [0.85, 1], ['100%', '0%']),
            }}
          />
        </>
      )}

      {/* WIPE TRANSITION - Simplified */}
      {variant === 'wipe' && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 w-full z-30 pointer-events-none bg-gradient-to-r from-black to-gray-900"
            style={{
              x: wipeLeft,
              opacity: 0.6,
            }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-full z-30 pointer-events-none bg-gradient-to-l from-black to-gray-900"
            style={{
              x: wipeRight,
              opacity: 0.6,
            }}
          />
        </>
      )}

      {/* Animated Section Content with 3D Transform */}
      <motion.div
        style={{
          opacity,
          scale,
          y,
          rotateX: variant === 'rotate' ? rotateX : 0,
          transformPerspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>

      {/* Decorative Transition Lines - Simplified */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-white z-50"
        style={{
          scaleX: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 1, 0]),
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-white z-50"
        style={{
          scaleX: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
          opacity: useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 0]),
        }}
      />

      {/* Corner Accents - Simplified */}
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-white z-50"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 1, 0]),
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-white z-50"
        style={{
          opacity: useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 0]),
        }}
      />
    </div>
  );
}
