'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Full-bleed hero slideshow -- the standard opening for a signage, fabrication
// or construction firm: the work carries the pitch, the copy sits over it.
//
// Only landscape source photos are used here. The portrait shots (pylons,
// billboards, interior walls) are strong images but crop badly to a wide
// viewport, so they live in the work mosaic further down instead.
const SLIDES = [
  {
    src: '/images/websitepics/T_Q_D_10.jpg',
    client: 'Jawara International Conference Centre',
    work: 'Entrance signage · Banjul',
    alt: 'Entrance signage at the Sir Dawda Kairaba Jawara International Conference Centre, Banjul',
  },
  {
    src: '/images/websitepics/T_Q_D_11.jpg',
    client: 'Ecobank',
    work: 'Premier Banking fascia',
    alt: 'Premier Banking by Ecobank fascia sign mounted above a branch entrance',
  },
  {
    src: '/images/websitepics/T_Q_D_3.jpg',
    client: 'LinkUp Electronics',
    work: 'Illuminated storefront sign',
    alt: 'Illuminated LinkUp Electronics storefront sign lit at night',
  },
  {
    src: '/images/websitepics/T_Q_D_22.jpg',
    client: 'Armanti Quality Food',
    work: 'Full vehicle wrap',
    alt: 'Armanti Quality Food delivery van in a full-colour printed wrap',
  },
  {
    src: '/images/websitepics/T_Q_D_2.jpg',
    client: 'Cultural Mural Hoarding',
    work: 'Large-format print',
    alt: 'Printed cultural mural hoarding running along a compound perimeter',
  },
];

const INTERVAL_MS = 6000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Honour prefers-reduced-motion: no auto-advance, no cross-fade. Visitors who
  // ask the OS for less movement get a static first slide and the dots.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const current = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Recent signage projects"
      className="relative h-[86svh] min-h-[560px] max-h-[900px] w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={i === index ? slide.alt : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Legibility scrim. Heavier at the bottom where the copy sits, and a
          top wash so the fixed header stays readable over bright photos. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-10 lg:pb-14">
          {/* Which project you're looking at */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-4">
            {current.client} <span className="text-gray-400">· {current.work}</span>
          </p>

          <h1 className="font-display text-[clamp(2.6rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.01em] text-white max-w-4xl text-balance">
            Signage and branding, built to last.
          </h1>

          <p className="mt-5 text-[clamp(1rem,1.5vw,1.25rem)] text-gray-200 leading-relaxed max-w-xl">
            Designed, fabricated and installed by our own team in The Gambia —
            since 2012.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="flex-1 sm:flex-none min-w-[9rem] inline-flex items-center justify-center px-7 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-colors"
            >
              See our work
            </Link>
            <Link
              href="/contact"
              className="flex-1 sm:flex-none min-w-[9rem] inline-flex items-center justify-center px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/25 text-white font-semibold rounded-full transition-colors"
            >
              Get a quote
            </Link>
          </div>

          {/* Slide controls */}
          <div className="mt-8 flex items-center gap-3">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${slide.client}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-10 bg-red-500' : 'w-4 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
