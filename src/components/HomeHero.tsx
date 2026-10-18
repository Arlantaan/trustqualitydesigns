'use client';

import Image from 'next/image';
import Link from 'next/link';

// Homepage hero.
//
// Layout is driven by grid-template-areas rather than source order, because the
// two viewports want genuinely different sequences:
//
//   mobile   head / photo / body   -- the work appears immediately, before the
//                                     sales copy. A signage company's homepage
//                                     should show a sign in the first screen.
//   desktop  head photo            -- classic split; photo spans both rows on
//            body photo              the right.
//
// Nothing here animates from opacity:0. The previous version staggered the text
// in with framer-motion, which meant the hero shipped invisible and stayed that
// way until JS hydrated -- a bad trade on slow mobile connections for an effect
// nobody asked for.
export function HomeHero() {
  return (
    <section className="relative bg-black pt-28 sm:pt-32 lg:pt-40 pb-[var(--space-4)] lg:pb-[var(--space-5)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="hero-grid gap-y-6 lg:gap-x-[var(--space-5)]">
          {/* Head */}
          <div style={{ gridArea: 'head' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-4">
              Signage &amp; Branding · The Gambia
            </p>
            <h1 className="font-display text-[clamp(2.6rem,8vw,5.6rem)] leading-[1.02] tracking-[-0.01em] text-white text-balance">
              Signage and branding, built to last.
            </h1>
          </div>

          {/* Photo */}
          <figure style={{ gridArea: 'photo' }} className="relative lg:self-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
              <Image
                src="/images/websitepics/T_Q_D_10.jpg"
                alt="Entrance signage for the Sir Dawda Kairaba Jawara International Conference Centre, Banjul"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-gray-400">
              Jawara International Conference Centre
              <span className="text-gray-500"> · Entrance signage, Banjul</span>
            </figcaption>
          </figure>

          {/* Body */}
          <div style={{ gridArea: 'body' }} className="lg:self-start">
            <p className="text-[clamp(1.05rem,1.6vw,1.3rem)] text-gray-300 leading-relaxed max-w-lg mb-7">
              From illuminated fascias to campaign billboards — designed, fabricated
              and installed by our own team, for some of the most recognised names
              in The Gambia.
            </p>

            {/* flex-1 with a min-width floor keeps both buttons on one row at
                360px rather than stacking and pushing the photo off-screen. */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/work"
                className="flex-1 min-w-[9rem] inline-flex items-center justify-center px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-colors"
              >
                See our work
              </Link>
              <Link
                href="/contact"
                className="flex-1 min-w-[9rem] inline-flex items-center justify-center px-6 py-4 border border-white/20 hover:border-white/50 text-white font-semibold rounded-full transition-colors"
              >
                Get a quote
              </Link>
            </div>

            <dl className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-4 border-t border-white/10 pt-5">
              {[
                { value: 'Since 2012', label: 'In business' },
                { value: '220+', label: 'Installations' },
                { value: '60+', label: 'Clients' },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-gray-500">{s.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-white leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
