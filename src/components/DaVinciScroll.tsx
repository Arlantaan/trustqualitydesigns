'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from 'framer-motion';
import { ReactNode, useRef, useEffect } from 'react';

// Leonardo da Vinci's Mathematical Constants
const PHI = 1.618033988749895; // Golden Ratio
const GOLDEN_ANGLE = 137.5077640500378; // Golden Angle in degrees
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34]; // Fibonacci sequence

interface DaVinciScrollProps {
  children: ReactNode;
  variant?: 'spiral' | 'golden' | 'fibonacci' | 'vitruvian' | 'parabolic';
  intensity?: 'subtle' | 'moderate' | 'dramatic';
  className?: string;
}

export function DaVinciScroll({
  children,
  variant = 'golden',
  intensity = 'moderate',
  className = '',
}: DaVinciScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Detect scroll direction using velocity
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Intensity multipliers
  const intensityMap = {
    subtle: 0.5,
    moderate: 1,
    dramatic: 1.5,
  };
  const mult = intensityMap[intensity];

  // Golden Ratio-based transforms
  if (variant === 'golden') {
    // Scale based on golden ratio
    const scale = useTransform(
      scrollYProgress,
      [0, 0.25, 0.5, 0.75, 1],
      [
        0.618 * mult, // 1/φ
        1,
        PHI / 2,
        1,
        0.618 * mult,
      ]
    );

    // Rotation using golden angle
    const rotate = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [GOLDEN_ANGLE * mult * -0.1, 0, GOLDEN_ANGLE * mult * 0.1]
    );

    // Y position with golden ratio progression
    const y = useTransform(
      scrollYProgress,
      [0, 0.382, 0.618, 1], // Golden ratio points
      [100 * mult, 0, 0, -100 * mult]
    );

    // Opacity fade with Fibonacci timing
    const opacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0.382] // 1/φ for exit opacity
    );

    return (
      <motion.div
        ref={ref}
        style={{ scale, rotate, y, opacity }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Fibonacci Spiral Animation
  if (variant === 'spiral') {
    const spiralProgress = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
    
    // Calculate spiral coordinates
    const x = useTransform(spiralProgress, (p) => {
      const radius = p * 50 * mult;
      return Math.cos(p * PHI) * radius;
    });

    const y = useTransform(spiralProgress, (p) => {
      const radius = p * 50 * mult;
      return Math.sin(p * PHI) * radius;
    });

    const rotate = useTransform(spiralProgress, (p) => p * GOLDEN_ANGLE);

    const scale = useTransform(
      scrollYProgress,
      [0, 0.2, 0.5, 0.8, 1],
      [0.5, 1, PHI / 1.5, 1, 0.618]
    );

    const opacity = useTransform(
      scrollYProgress,
      FIBONACCI.slice(0, 5).map((_, i) => i / 4),
      [0, 0.5, 1, 0.8, 0.3]
    );

    return (
      <motion.div
        ref={ref}
        style={{ x, y, rotate, scale, opacity }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Fibonacci sequence-based transforms
  if (variant === 'fibonacci') {
    // Use Fibonacci ratios for timing points
    const fibPoints = [0, 0.125, 0.25, 0.375, 0.625, 0.875, 1]; // Fibonacci-inspired distribution
    
    const scale = useTransform(
      scrollYProgress,
      fibPoints,
      [0.618, 0.8, 1, PHI / 1.2, 1, 0.9, 0.618]
    );

    const rotateX = useTransform(
      scrollYProgress,
      [0, 0.25, 0.5, 0.75, 1],
      [21, 8, 0, -8, -21] // Fibonacci numbers: 21, 8
    );

    const rotateY = useTransform(
      scrollYProgress,
      [0, 0.33, 0.66, 1],
      [13 * mult, 0, 0, -13 * mult] // Fibonacci: 13
    );

    const y = useTransform(
      scrollYProgress,
      fibPoints,
      [144 * mult, 89 * mult, 55 * mult, 0, -55 * mult, -89 * mult, -144 * mult] // Fibonacci: 144, 89, 55
    );

    const opacity = useTransform(
      scrollYProgress,
      [0, 0.1, 0.2, 0.8, 0.9, 1],
      [0, 0.5, 1, 1, 0.8, 0]
    );

    return (
      <motion.div
        ref={ref}
        style={{
          scale,
          rotateX,
          rotateY,
          y,
          opacity,
          transformPerspective: 1000,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Vitruvian Man - Circle and Square geometry
  if (variant === 'vitruvian') {
    // Circle motion (scroll down) vs Square motion (scroll up)
    const circlePhase = useTransform(scrollYProgress, [0, 0.5], [0, Math.PI]);
    const squarePhase = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

    const x = useTransform(scrollYProgress, (p) => {
      if (p < 0.5) {
        // Circular motion
        return Math.sin(p * Math.PI * 2) * 100 * mult;
      } else {
        // Square motion
        const phase = (p - 0.5) * 4;
        if (phase < 1) return -100 * mult + phase * 200 * mult;
        if (phase < 2) return 100 * mult;
        if (phase < 3) return 100 * mult - (phase - 2) * 200 * mult;
        return -100 * mult;
      }
    });

    const y = useTransform(scrollYProgress, (p) => {
      if (p < 0.5) {
        // Circular motion
        return Math.cos(p * Math.PI * 2) * 50 * mult;
      } else {
        // Square motion
        const phase = (p - 0.5) * 4;
        if (phase < 1) return -50 * mult;
        if (phase < 2) return -50 * mult + (phase - 1) * 100 * mult;
        if (phase < 3) return 50 * mult;
        return 50 * mult - (phase - 3) * 100 * mult;
      }
    });

    const rotate = useTransform(
      scrollYProgress,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 90, 180, 270, 360]
    );

    const scale = useTransform(
      scrollYProgress,
      [0, 0.25, 0.5, 0.75, 1],
      [0.8, PHI / 1.5, 1, PHI / 1.5, 0.8]
    );

    const opacity = useTransform(
      scrollYProgress,
      [0, 0.15, 0.85, 1],
      [0, 1, 1, 0]
    );

    return (
      <motion.div
        ref={ref}
        style={{ x, y, rotate, scale, opacity }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Parabolic Arc - Trajectory mathematics
  if (variant === 'parabolic') {
    // Parabolic curve: y = ax²
    const x = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [-150 * mult, 0, 150 * mult]
    );

    const y = useTransform(scrollYProgress, (p) => {
      // Parabola: vertex at center
      const normalized = (p - 0.5) * 2; // -1 to 1
      return -(normalized * normalized) * 200 * mult + 100 * mult;
    });

    const rotate = useTransform(scrollYProgress, (p) => {
      // Tangent angle of parabola
      const normalized = (p - 0.5) * 2;
      return Math.atan(2 * normalized) * (180 / Math.PI) * mult;
    });

    const scale = useTransform(
      scrollYProgress,
      [0, 0.2, 0.5, 0.8, 1],
      [0.5, 1, PHI / 1.2, 1, 0.5]
    );

    const opacity = useTransform(
      scrollYProgress,
      [0, 0.1, 0.5, 0.9, 1],
      [0, 1, 1, 1, 0]
    );

    const rotateX = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [34, 0, -34] // Fibonacci: 34
    );

    return (
      <motion.div
        ref={ref}
        style={{
          x,
          y,
          rotate,
          rotateX,
          scale,
          opacity,
          transformPerspective: 1200,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return <div ref={ref} className={className}>{children}</div>;
}
