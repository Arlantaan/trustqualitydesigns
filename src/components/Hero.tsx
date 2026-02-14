'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedText } from './AnimatedText';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  backgroundVideo?: string;
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  cta,
  backgroundVideo,
  backgroundImage,
}: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-br from-gray-950 via-red-950 to-black">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-red-700/30 to-red-900/30 animate-pulse-slow" />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Background Media */}
      {backgroundVideo && (
        <video
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full object-cover bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtitle Pill */}
        {subtitle && (
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-700/20 backdrop-blur-xl border border-white/30 text-white text-sm font-bold rounded-full shadow-xl shadow-red-500/30 uppercase tracking-wider">
              ✨ {subtitle}
            </span>
          </motion.div>
        )}

        {/* Main Title */}
        <AnimatedText 
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.9]"
          delay={0.3}
        >
          {title}
        </AnimatedText>

        {/* Description */}
        {description && (
          <motion.p variants={itemVariants} className="text-xl md:text-3xl text-gray-200 mb-16 max-w-4xl mx-auto font-light leading-relaxed" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            {description}
          </motion.p>
        )}

        {/* CTA Button */}
        {cta && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <Link
              href={cta.href}
              className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-red-500/60 transition-all duration-500 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10">
                {cta.label}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
