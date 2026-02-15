'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoMarqueeProps {
  logos?: string[];
  speed?: number;
}

export function LogoMarquee({ 
  logos = [
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/octopus-tech-logo-rebranded-white.png',
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/octopus-tech-logo-rebranded-white.png',
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/octopus-tech-logo-rebranded-white.png',
  ],
  speed = 30 
}: LogoMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 1;
      const width = marquee.scrollWidth / 2;
      
      if (Math.abs(position) >= width) {
        position = 0;
      }
      
      marquee.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed]);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-20 bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "auto" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-[0.3em] border-b-2 border-gray-600 pb-2">
              Our Partners
            </span>
          </motion.div>

          {/* Main Heading with Gradient Animation */}
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-center mb-4 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-white">
              Trusted By Leading Brands
            </span>
            
            {/* Decorative Underline */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-white"
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto"
          >
            Delivering exceptional branding and signage solutions to industry leaders
          </motion.p>
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 to-transparent z-10" />

        {/* Marquee Container */}
        <div ref={marqueeRef} className="flex items-center gap-16 whitespace-nowrap">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`logo-${index}`}
              className="relative flex-shrink-0 w-40 h-20 transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-110"
            >
              <Image
                src={logo}
                alt={`Client logo ${index + 1}`}
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
