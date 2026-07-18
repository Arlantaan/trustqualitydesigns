'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const ease = [0.76, 0, 0.24, 1];

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Red bar sweeps in first, then black curtain over it */}
        <motion.div
          className="fixed inset-0 z-[9990] bg-red-600 pointer-events-none"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0] }}
          transition={{ duration: 0.85, times: [0, 0.38, 0.62, 1], ease }}
        />
        <motion.div
          className="fixed inset-0 z-[9991] bg-black pointer-events-none"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0] }}
          transition={{ duration: 0.85, times: [0, 0.4, 0.6, 1], ease, delay: 0.05 }}
        />

        {/* Page content fades in after curtain opens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.55 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
