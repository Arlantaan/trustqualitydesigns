'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  // STATE MANAGEMENT
  // These control what's visible and when animations happen
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });
  
  // REF to track button position for blob origin
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-gray-950/95 backdrop-blur-xl shadow-xl shadow-red-500/20' : 'bg-transparent'
      )}
    >
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50 group-hover:shadow-xl group-hover:shadow-red-500/70 transition-all duration-300 group-hover:scale-110">
            <span className="text-white font-black text-lg">TQD</span>
          </div>
          <span className="font-black text-xl hidden sm:inline text-white">
            Trust Quality
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
                isScrolled ? 'text-gray-200 hover:text-red-400' : 'text-white hover:text-red-300'
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="group relative px-8 py-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white text-sm font-bold rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Mobile Menu Toggle - Hamburger Icon */}
        {/* z-[60] ensures button stays above blob (z-50) so you can close it */}
        <button
          ref={buttonRef}
          onClick={handleMenuToggle}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none z-[60] relative"
          aria-label="Toggle menu"
        >
          {/* Two lines that animate into X shape */}
          <span
            className={cn(
              'w-6 h-0.5 transition-all duration-300',
              isMobileMenuOpen ? 'bg-white' : 'bg-white',
              isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
            )}
          />
          <span
            className={cn(
              'w-6 h-0.5 transition-all duration-300',
              isMobileMenuOpen ? 'bg-white' : 'bg-white',
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            )}
          />
        </button>
      </nav>

      {/* MORPHING BLOB MENU */}
      {/* AnimatePresence: Framer Motion component that animates components entering/leaving DOM */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* BLOB BACKGROUND - The liquid morphing shape */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              initial={{
                // START: Small circle at button position
                clipPath: `circle(0% at ${rippleOrigin.x}px ${rippleOrigin.y}px)`,
              }}
              animate={{
                // END: Expands to cover entire screen
                // 150% ensures it covers corners even on rotation
                clipPath: `circle(150% at ${rippleOrigin.x}px ${rippleOrigin.y}px)`,
              }}
              exit={{
                // CLOSING: Shrinks back to origin point (SAME ELASTIC EFFECT)
                clipPath: `circle(0% at ${rippleOrigin.x}px ${rippleOrigin.y}px)`,
              }}
              transition={{
                // ELASTIC BOUNCE - feels like liquid (SAME for open AND close)
                type: 'spring',
                stiffness: 50,  // Lower = more wobbly
                damping: 25,    // Lower = more bouncy
                duration: 0.8,
              }}
              style={{
                // Gradient background - red liquid metal theme
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              }}
            />

            {/* MENU CONTENT - Items and links */}
            <motion.div
              className="fixed inset-0 z-50 md:hidden flex items-center justify-center"
              initial={{ opacity: 0 }}  // Fade in
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}     // Fade out
              transition={{ delay: 0.2, duration: 0.3 }} // Start after blob begins
            >
              <nav className="w-full max-w-md px-8">
                {/* Container for staggered animations */}
                <motion.div
                  className="space-y-6"
                  // STAGGER: Each child animates in sequence
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,  // 0.1s delay between each item
                        delayChildren: 0.3,    // Wait for blob to expand first
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* MENU ITEMS - Each one bounces in */}
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.href}
                      // Individual item animation (used by stagger parent)
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          y: 50,           // Start 50px below
                          scale: 0.8,      // Start smaller
                        },
                        visible: { 
                          opacity: 1, 
                          y: 0,            // End at normal position
                          scale: 1,        // End at normal size
                          transition: {
                            type: 'spring',
                            stiffness: 100,
                            damping: 15,
                          }
                        },
                      }}
                      // HOVER ANIMATION: Magnetic lift effect
                      whileHover={{ 
                        scale: 1.1,        // Grow 10%
                        x: 10,             // Shift right slightly
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}  // Shrink when clicked
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-4xl font-black text-white hover:text-red-200 transition-colors relative group"
                      >
                        {/* Glass morphism effect behind text on hover */}
                        <span className="absolute -inset-4 bg-white/10 backdrop-blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative">{item.label}</span>
                        
                        {/* Index number - adds rhythm */}
                        <span className="absolute -left-8 top-0 text-sm text-red-300 opacity-50">
                          0{index + 1}
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* CTA BUTTON - Appears last with extra emphasis */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 50, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                        }
                      },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-8 py-4 bg-transparent border-2 border-white text-white text-center text-lg font-bold rounded-full mt-8 hover:bg-white hover:text-red-600 transition-all shadow-2xl"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
