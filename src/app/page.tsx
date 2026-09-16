'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeHero, LogoMarquee } from '@/components';

// One-shot scroll reveal. Deliberately triggered, not scroll-linked: driving
// opacity continuously from scroll position made sections fade back out on the
// way up, which reads as jank rather than polish. Reveal once, then stay put.
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 mb-[var(--space-4)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400 mb-3">{eyebrow}</p>
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05] text-white">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-semibold text-gray-300 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// Every image below is a real installation from /public/images/websitepics.
// Photos 14–17 and 19 carry a red brochure border baked into the file and are
// deliberately not used here — they'd break the clean edge of the grid.
const SERVICES = [
  {
    title: 'Fascia & 3D Letters',
    blurb: 'Illuminated and dimensional lettering for building fronts.',
    image: '/images/websitepics/T_Q_D_11.jpg',
    alt: 'Premier Banking by Ecobank fascia sign above a branch entrance',
  },
  {
    title: 'Pylon & Monument Signs',
    blurb: 'Tall roadside identity that is legible from a distance.',
    image: '/images/websitepics/T_Q_D_13.jpg',
    alt: 'GNPC pylon sign with stacked illuminated letters',
  },
  {
    title: 'Billboards & Hoardings',
    blurb: 'Large-format print for campaigns, sites and events.',
    image: '/images/websitepics/T_Q_D_2.jpg',
    alt: 'Printed perimeter hoarding wrapping a government compound',
  },
  {
    title: 'Vehicle Wraps',
    blurb: 'Fleet branding that works wherever the vehicle goes.',
    image: '/images/websitepics/T_Q_D_7.jpg',
    alt: 'Armanti Quality Food delivery van in a full-colour wrap',
  },
  {
    title: 'Interior & Event Branding',
    blurb: 'Backdrops, feature walls and branded spaces.',
    image: '/images/websitepics/T_Q_D_4.jpg',
    alt: 'Mirrored luxury backdrop wall with gold lettering',
  },
  {
    title: 'Retail & Point-of-Sale',
    blurb: 'Displays and stands that sell at the shelf.',
    image: '/images/websitepics/T_Q_D_21.jpg',
    alt: 'Nescafé branded floor display unit in a supermarket',
  },
];

const FEATURED = [
  {
    slug: 'jawara-conference-centre-signage',
    client: 'Jawara International Conference Centre',
    what: 'Entrance signage · Banjul',
    image: '/images/websitepics/T_Q_D_10.jpg',
  },
  {
    slug: 'oic-summit-hoardings',
    client: 'OIC Banjul Summit 2024',
    what: 'Campaign hoardings & billboards',
    image: '/images/websitepics/T_Q_D_9.jpg',
  },
  {
    slug: 'linkup-storefront-sign',
    client: 'LinkUp Electronics',
    what: 'Illuminated storefront sign',
    image: '/images/websitepics/T_Q_D_3.jpg',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Consultation',
    body: 'We visit the site, take measurements and understand what the sign needs to do for you.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'Concepts and a scaled mock-up on your actual building before anything is cut.',
  },
  {
    step: '03',
    title: 'Fabrication',
    body: 'Built in our workshop — aluminium, acrylic, LED and large-format print.',
  },
  {
    step: '04',
    title: 'Installation',
    body: 'Our own team installs, and we come back if anything needs attention.',
  },
];

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* What we make */}
      <FadeInSection>
        <section className="section-y bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <SectionHeading
              eyebrow="What we make"
              title="Every kind of sign a business needs."
              action={{ label: 'All services', href: '/services' }}
            />
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[var(--space-3)] gap-y-[var(--space-4)]">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <Link href="/services" className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">{s.blurb}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeInSection>

      {/* Selected work */}
      <FadeInSection>
        <section className="section-y bg-[#0a0a0a] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <SectionHeading
              eyebrow="Selected work"
              title="Names you already know, on buildings you already pass."
              action={{ label: 'All projects', href: '/work' }}
            />
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-3)]">
              {FEATURED.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
                      <Image
                        src={p.image}
                        alt={`${p.client} — ${p.what}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
                      {p.client}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{p.what}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeInSection>

      {/* Clients */}
      <FadeInSection>
        <LogoMarquee />
      </FadeInSection>

      {/* Process */}
      <FadeInSection>
        <section className="section-y bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-[var(--space-4)] lg:gap-[var(--space-5)] items-center">
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
                  <Image
                    src="/images/websitepics/T_Q_D_12.jpg"
                    alt="GNPC dimensional letters being assembled in the workshop"
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-gray-500">
                  GNPC letters in fabrication, before installation on the pylon.
                </figcaption>
              </figure>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400 mb-3">How a project runs</p>
                <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05] text-white mb-[var(--space-3)]">
                  Measured, made and mounted by one team.
                </h2>
                <ol className="space-y-[var(--space-3)]">
                  {PROCESS.map((p) => (
                    <li key={p.step} className="grid grid-cols-[3rem_1fr] gap-4">
                      <span className="font-display text-2xl text-red-400 leading-none pt-1">{p.step}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                        <p className="mt-1 text-gray-400 leading-relaxed">{p.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Contact CTA */}
      <FadeInSection>
        <section className="section-y bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_0.4fr] gap-[var(--space-4)] items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400 mb-3">Start a project</p>
                <h2 className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] leading-[1.02] text-white mb-5">
                  Have a sign in mind?
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  Tell us what you need and where it&apos;s going. We&apos;ll come out, measure
                  up and give you a clear quote — no obligation.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-colors"
                >
                  Get a quote
                </Link>
                <a
                  href="https://wa.me/2207516895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-4 border border-white/20 hover:border-white/50 text-white font-semibold rounded-full transition-colors"
                >
                  WhatsApp us
                </a>
                <div className="mt-2 text-center text-sm text-gray-500">
                  <a href="tel:+2207516895" className="hover:text-gray-300 transition-colors">+220 751 6895</a>
                  <span className="mx-2">·</span>
                  <a href="mailto:info@trustqualitydesign.com" className="hover:text-gray-300 transition-colors">
                    info@trustqualitydesign.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </>
  );
}
