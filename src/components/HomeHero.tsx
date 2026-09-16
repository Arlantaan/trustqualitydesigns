'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Homepage hero. Split layout rather than full-bleed on purpose: the source
// photos are ~1000px wide, and stretching one across a 1440px viewport turns it
// soft. At ~55% of the width it stays near native resolution and reads sharp.
export function HomeHero() {
  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="relative bg-black pt-32 sm:pt-36 lg:pt-40 pb-[var(--space-5)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-[var(--space-4)] lg:gap-[var(--space-5)] items-center">
          {/* Copy */}
          <div>
            <motion.p
              custom={0}
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400 mb-5"
            >
              Signage &amp; Branding · Serrekunda, The Gambia
            </motion.p>

            <motion.h1
              custom={1}
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(2.8rem,5.5vw,5.6rem)] leading-[1.02] tracking-[-0.01em] text-white mb-6"
            >
              Signage and branding,
              <br />
              built to last.
            </motion.h1>

            <motion.p
              custom={2}
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="text-[clamp(1.05rem,1.6vw,1.3rem)] text-gray-300 leading-relaxed max-w-lg mb-8"
            >
              From illuminated fascias to campaign billboards — designed, fabricated
              and installed by our own team, for some of the most recognised names
              in The Gambia.
            </motion.p>

            <motion.div
              custom={3}
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                href="/work"
                className="inline-flex items-center gap-3 px-7 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-colors"
              >
                See our work
                <span aria-hidden className="h-[2px] w-6 bg-white/80 rounded-full" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-7 py-4 border border-white/20 hover:border-white/50 text-white font-semibold rounded-full transition-colors"
              >
                Get a quote
              </Link>
            </motion.div>

            <motion.dl
              custom={4}
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-10 gap-y-4 max-w-md border-t border-white/10 pt-6"
            >
              {[
                { value: 'Since 2012', label: 'In business' },
                { value: '220+', label: 'Installations' },
                { value: '60+', label: 'Clients' },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">{s.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-white leading-none">{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Flagship photo */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
              <Image
                src="/images/websitepics/T_Q_D_10.jpg"
                alt="Entrance signage for the Sir Dawda Kairaba Jawara International Conference Centre, Banjul"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-gray-400">
              <span>Sir Dawda Kairaba Jawara International Conference Centre</span>
              <span className="shrink-0 text-gray-500">Entrance signage · Banjul</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
