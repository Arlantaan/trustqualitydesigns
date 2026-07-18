'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  '/images/websitepics/T_Q_D_10.jpg',
  '/images/websitepics/T_Q_D_11.jpg',
  '/images/websitepics/T_Q_D_21.jpg',
  '/images/websitepics/T_Q_D_6.jpg',
];

export function FullscreenSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[80vh] min-h-[520px] overflow-hidden rounded-[28px] border border-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slides[index]}
            alt="Project highlight"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.3em] text-white/70">
        Work we&apos;re proud of
      </div>
    </div>
  );
}
