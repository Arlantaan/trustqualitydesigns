'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const isTouchDevice = () => {
  if (typeof window === 'undefined') return true;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  return hasTouch || isMobileUA || isCoarsePointer;
};

type CursorState = 'default' | 'view' | 'link' | 'text';

const cursorSizes: Record<CursorState, { w: number; h: number }> = {
  default: { w: 14, h: 14 },
  view:    { w: 90, h: 90 },
  link:    { w: 44, h: 44 },
  text:    { w: 3,  h: 28 },
};

export function MagneticCursor() {
  if (isTouchDevice()) return null;

  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Tight spring for the dot
  const dotX = useSpring(mouseX, { damping: 28, stiffness: 400, mass: 0.4 });
  const dotY = useSpring(mouseY, { damping: 28, stiffness: 400, mass: 0.4 });

  // Laggy spring for the follower ring
  const ringX = useSpring(mouseX, { damping: 35, stiffness: 150, mass: 0.8 });
  const ringY = useSpring(mouseY, { damping: 35, stiffness: 150, mass: 0.8 });

  // Extra-lag ghost for replica effect
  const ghostX = useSpring(mouseX, { damping: 45, stiffness: 90, mass: 1.2 });
  const ghostY = useSpring(mouseY, { damping: 45, stiffness: 90, mass: 1.2 });

  useEffect(() => {
    if (isTouchDevice()) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const isImage = !!target.closest('[data-cursor="view"]') || target.tagName === 'IMG';
      const isLink = !!target.closest('a') || target.tagName === 'BUTTON';
      const isText = ['P', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'LI'].includes(target.tagName);

      if (isImage) setCursorState('view');
      else if (isLink) setCursorState('link');
      else if (isText) setCursorState('text');
      else setCursorState('default');
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown  = () => setIsClicking(true);
    const handleMouseUp    = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const { w, h } = cursorSizes[cursorState];
  const scale = isClicking ? 0.82 : 1;

  return (
    <div className="hidden lg:block">
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            width: w * scale,
            height: h * scale,
            borderRadius: cursorState === 'text' ? '3px' : '9999px',
            backgroundColor:
              cursorState === 'view' ? 'rgba(239,68,68,0.12)' :
              cursorState === 'link' ? 'rgba(239,68,68,0.25)' :
              'transparent',
            border: cursorState === 'view' ? '2px solid rgb(239,68,68)' :
                    cursorState === 'link' ? '2px solid rgba(239,68,68,0.8)' :
                    '2px solid rgba(239,68,68,0.9)',
          }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center justify-center"
        >
          {cursorState === 'view' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] select-none"
            >
              View
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Lagging follower ring — only in default mode */}
      {cursorState === 'default' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        >
          <motion.div
            animate={{ opacity: isClicking ? 0.25 : 0.55, scale: isClicking ? 0.7 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-9 h-9 rounded-full border border-red-500"
          />
        </motion.div>
      )}
    </div>
  );
}
