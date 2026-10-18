'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface LogoMarqueeProps {
  logos?: string[];
  speed?: number;
}

export function LogoMarquee({ 
  logos = [
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/gtbank_logo.png',
    '/images/logos/octopus-tech-logo-rebranded-white.png',
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/gtbank_logo.png',
    '/images/logos/octopus-tech-logo-rebranded-white.png',
    '/images/logos/ecobank-the-pan-african-bank-loho-HD.png',
    '/images/logos/gtbank_logo.png',
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
    <section className="py-[var(--space-5)] bg-black overflow-hidden relative">
      {/* Heading follows the same eyebrow + display-face pattern as every
          other homepage section, so this block reads as part of the page
          rather than a component dropped in from elsewhere. */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-2">Clients</p>
        <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white">
          Trusted by the names on the high street.
        </h2>
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
              className="relative flex-shrink-0 w-32 h-14 transition-opacity duration-300 opacity-80 hover:opacity-100"
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
