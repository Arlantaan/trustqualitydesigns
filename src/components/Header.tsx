'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  // STATE MANAGEMENT
  // These control what's visible and when animations happen
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });
  
  // REF to track button position for blob origin
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);

      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, currentY / maxScroll)));

      const isScrollingDown = currentY > lastY && currentY > 140;
      setIsHidden(isScrollingDown);
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // LOCK BODY SCROLL when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Unlock body scroll and restore position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  // CAPTURE where user clicked for ripple effect origin
  const handleMenuToggle = () => {
    if (buttonRef.current && !isMobileMenuOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      setRippleOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      animate={{ y: isHidden ? -88 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={cn('fixed top-0 left-0 right-0 transition-all duration-300', isMobileMenuOpen ? 'z-[10000]' : 'z-50')}
    >
      {/* ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />

      <div className={cn(
        'mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 transition-all duration-300',
        isScrolled ? 'pt-2' : 'pt-4'
      )}>
        <div
          className={cn(
            'relative rounded-full p-[1px] transition-all duration-300',
            isScrolled
              ? 'bg-gradient-to-r from-white/25 via-red-500/50 to-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.55)]'
              : 'bg-gradient-to-r from-white/15 via-red-500/35 to-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.45)]'
          )}
        >
          <div
            className={cn(
              'relative rounded-full overflow-hidden border border-white/10 backdrop-blur-2xl transition-all duration-300',
              isScrolled
                ? 'bg-gradient-to-b from-black/75 via-black/60 to-black/45'
                : 'bg-gradient-to-b from-black/60 via-black/45 to-black/35'
            )}
          >
            {/* inner sheen + shimmer */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/12 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-full shimmer opacity-25" />

            {/* progress bar */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-transparent">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                style={{ scaleX: scrollProgress, transformOrigin: '0% 50%' }}
              />
            </div>

            <nav className={cn(
              'flex items-center justify-between px-6 transition-all duration-300',
              isScrolled ? 'py-3' : 'py-5'
            )}>
        {/* Brand */}
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/images/websitepics/Favicontqd.png"
            alt="Trust Quality Design logo"
            width={32}
            height={32}
            className={cn(
              'object-contain brightness-110 contrast-110 drop-shadow-[0_1px_6px_rgba(255,255,255,0.35)] transition-all duration-300',
              isScrolled ? 'h-7 w-7' : 'h-8 w-8'
            )}
            priority
          />
          <span className={cn(
            'font-black text-white transition-all duration-300',
            isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
          )}>
            Trust Quality Design
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-base font-semibold transition-all duration-200 hover:scale-110 relative group',
                'text-white/85 hover:text-white'
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="group relative px-8 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-sm font-bold rounded-full ring-1 ring-white/10 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.08] overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Mobile Menu Toggle - Hamburger Icon */}
        <button
          ref={buttonRef}
          onClick={handleMenuToggle}
          type="button"
          className="md:hidden flex flex-col gap-1.5 focus:outline-none relative z-[10001] touch-manipulation"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {/* Two lines that animate into X shape */}
          <span
            className={cn(
              'w-6 h-0.5 transition-all duration-300',
              isMobileMenuOpen ? 'bg-red-500' : 'bg-red-500',
              isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
            )}
          />
          <span
            className={cn(
              'w-6 h-0.5 transition-all duration-300',
              isMobileMenuOpen ? 'bg-red-500' : 'bg-red-500',
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            )}
          />
        </button>
            </nav>
          </div>
        </div>
      </div>

      {/* SIMPLE MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-screen z-[9999] md:hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center justify-center h-full w-full px-6" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 h-12 w-12 rounded-full border border-white/30 text-white text-2xl leading-none flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ×
              </button>
              <nav className="w-full max-w-md">
                <div className="space-y-4">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-xl font-bold text-white text-center py-4 px-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 active:scale-95 transition-all"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navigation.length * 0.08 + 0.2 }}
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-8 py-4 bg-white text-red-600 text-center text-lg font-bold rounded-full mt-4 hover:bg-red-50 active:scale-95 transition-all shadow-xl"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
