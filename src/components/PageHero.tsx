'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  /** 0–1 brightness of the dark overlay. Defaults to 0.65 */
  dimAmount?: number;
}

const titleVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, delay: 0.15, ease: [0.19, 1, 0.22, 1] },
  },
};

export function PageHero({ title, subtitle, image, dimAmount = 0.65 }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden bg-black"
      style={{ minHeight: '50vh' }}
    >
      {/* Parallax background image */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${dimAmount})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
        {/* Animated red line above title */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="h-1 w-24 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-8 rounded-full"
        />

        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight"
        >
          {title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="inline-block mr-4"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Animated bottom line */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="h-px w-40 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-10"
        />
      </div>
    </section>
  );
}
