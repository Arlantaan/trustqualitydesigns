'use client';

import { motion } from 'framer-motion';

export function ScrollIndicator() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={handleScroll}
    >
      <motion.div
        className="flex flex-col items-center gap-2 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Text */}
        <motion.span
          className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold group-hover:text-white transition-colors"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Scroll
        </motion.span>

        {/* Animated Circle with Mouse Icon */}
        <div className="relative w-8 h-12 rounded-full border-2 border-gray-600 group-hover:border-white transition-colors flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-white"
            animate={{
              y: [0, 16, 0],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Chevron Indicators */}
        <div className="flex flex-col gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              className="w-4 h-2 text-gray-500 group-hover:text-white"
              fill="none"
              viewBox="0 0 16 8"
              animate={{
                y: [0, 4, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            >
              <path
                d="M1 1L8 7L15 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
