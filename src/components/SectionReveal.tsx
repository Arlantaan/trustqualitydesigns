'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  variant?: 'slideLeft' | 'slideRight' | 'scale' | 'elevate' | 'fade';
  delay?: number;
  className?: string;
  parallaxIntensity?: number;
}

export function SectionReveal({
  children,
  variant = 'elevate',
  delay = 0,
  className = '',
  parallaxIntensity = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Create parallax effect if intensity is set
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxIntensity, -parallaxIntensity]
  );

  const variants: Record<string, Variants> = {
    slideLeft: {
      hidden: {
        opacity: 0,
        x: -100,
        scale: 0.95,
        rotateY: 10,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 1,
          delay,
          ease: [0.22, 1, 0.36, 1], // Custom easing for smooth, professional feel
        },
      },
    },
    slideRight: {
      hidden: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        rotateY: -10,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 1,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    },
    scale: {
      hidden: {
        opacity: 0,
        scale: 0.85,
        y: 60,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    elevate: {
      hidden: {
        opacity: 0,
        y: 120,
        rotateX: 25,
        scale: 0.9,
      },
      visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
          duration: 1.2,
          delay,
          ease: [0.19, 1, 0.22, 1],
        },
      },
    },
    fade: {
      hidden: {
        opacity: 0,
        y: 40,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay,
          ease: 'easeOut',
        },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants[variant]}
      style={{
        y: parallaxIntensity !== 0 ? y : undefined,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
