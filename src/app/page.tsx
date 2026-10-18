import Image from 'next/image';
import Link from 'next/link';
import { HeroSlideshow, LogoMarquee } from '@/components';

// Homepage.
//
// Deliberately NOT a column of equally-weighted card sections with a fade-in on
// each. That pattern is what made this page feel like endless scrolling: every
// band had the same rhythm, the same air, and showed three items at a time.
//
// Instead: a full-bleed slideshow, a thin credentials strip, services as
// labelled tiles, and the work as one dense asymmetric mosaic. Content renders
// immediately -- no scroll-triggered reveals.

const SERVICES = [
  {
    title: 'Fascia & 3D Letters',
    image: '/images/websitepics/T_Q_D_11.jpg',
    alt: 'Premier Banking by Ecobank fascia sign',
  },
  {
    title: 'Pylon & Monument Signs',
    image: '/images/websitepics/T_Q_D_13.jpg',
    alt: 'GNPC pylon sign with stacked illuminated letters',
  },
  {
    title: 'Billboards & Hoardings',
    image: '/images/websitepics/T_Q_D_9.jpg',
    alt: 'OIC Banjul Summit roadside billboards',
  },
  {
    title: 'Vehicle Wraps',
    image: '/images/websitepics/T_Q_D_22.jpg',
    alt: 'Armanti Quality Food van in a full printed wrap',
  },
  {
    title: 'Interior & Event Branding',
    image: '/images/websitepics/T_Q_D_6.jpg',
    alt: 'Mirrored interior feature wall graphics',
  },
  {
    title: 'Retail & Point-of-Sale',
    image: '/images/websitepics/T_Q_D_21.jpg',
    alt: 'Nescafe branded floor display unit',
  },
];

// Mosaic: the first tile spans two columns and two rows on desktop so the page
// has a focal point instead of six identical rectangles.
const WORK = [
  {
    slug: 'jawara-conference-centre-signage',
    client: 'Jawara Conference Centre',
    work: 'Entrance signage',
    image: '/images/websitepics/T_Q_D_10.jpg',
    span: 'md:col-span-2 md:row-span-2',
    ratio: 'aspect-[4/3]',
  },
  {
    slug: 'oic-summit-billboards',
    client: 'OIC Banjul Summit',
    work: 'Roadside billboards',
    image: '/images/websitepics/T_Q_D_8.jpg',
    span: '',
    ratio: 'aspect-[3/4]',
  },
  {
    slug: 'linkup-storefront-sign',
    client: 'LinkUp Electronics',
    work: 'Illuminated storefront',
    image: '/images/websitepics/T_Q_D_3.jpg',
    span: '',
    ratio: 'aspect-[3/4]',
  },
  {
    slug: 'mirrored-backdrop-wall',
    client: 'Mirrored',
    work: 'Luxury backdrop wall',
    image: '/images/websitepics/T_Q_D_4.jpg',
    span: '',
    ratio: 'aspect-square',
  },
  {
    slug: 'armanti-vehicle-wrap',
    client: 'Armanti Quality Food',
    work: 'Vehicle wrap',
    image: '/images/websitepics/T_Q_D_7.jpg',
    span: '',
    ratio: 'aspect-square',
  },
];

const PROCESS = [
  { step: '01', title: 'Consultation', body: 'We visit the site and measure up.' },
  { step: '02', title: 'Design', body: 'A scaled mock-up on your actual building.' },
  { step: '03', title: 'Fabrication', body: 'Built in our workshop — metal, acrylic, LED.' },
  { step: '04', title: 'Installation', body: 'Installed by our team, with aftercare.' },
];

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
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-2">{eyebrow}</p>
        <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white">{title}</h2>
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

export default function Home() {
  return (
    <>
      <HeroSlideshow />

      {/* Credentials strip — a thin band, not a full section. */}
      <section className="bg-[#0a0a0a] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <dl className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { value: 'Since 2012', label: 'In business' },
              { value: '220+', label: 'Installations' },
              { value: '60+', label: 'Clients' },
              { value: 'Serrekunda', label: 'The Gambia' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2.5">
                <dd className="text-lg font-semibold text-white leading-none">{s.value}</dd>
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-gray-500">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services — labelled tiles, caption over the image to keep it compact */}
      <section className="py-[var(--space-5)] bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="What we make"
            title="Every kind of sign a business needs."
            action={{ label: 'All services', href: '/services' }}
          />
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <Link
                  href="/services"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10"
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-3 text-sm sm:text-base font-semibold text-white">
                    {s.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Work — dense mosaic, one focal tile */}
      <section className="py-[var(--space-5)] bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Selected work"
            title="Names you already know, on buildings you already pass."
            action={{ label: 'All projects', href: '/work' }}
          />
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:auto-rows-[minmax(0,1fr)]">
            {WORK.map((p) => (
              <li key={p.slug} className={p.span}>
                <Link
                  href={`/work/${p.slug}`}
                  className={`group relative block h-full w-full overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10 ${p.span ? 'aspect-[4/3] md:aspect-auto' : p.ratio}`}
                >
                  <Image
                    src={p.image}
                    alt={`${p.client} — ${p.work}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">{p.client}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{p.work}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LogoMarquee />

      {/* Process — a single compact row, not a half-page feature */}
      <section className="py-[var(--space-5)] bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading eyebrow="How a project runs" title="Measured, made and mounted by one team." />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <li key={p.step} className="border-t border-white/15 pt-4">
                <span className="font-display text-xl text-red-400">{p.step}</span>
                <h3 className="mt-1 text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact band */}
      <section className="py-[var(--space-5)] bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05] text-white mb-3">
                Have a sign in mind?
              </h2>
              <p className="text-gray-300 leading-relaxed max-w-xl">
                Tell us what you need and where it&apos;s going. We&apos;ll come out, measure
                up and give you a clear quote — no obligation.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 lg:w-64">
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
              <p className="text-center text-sm text-gray-500">
                <a href="tel:+2207516895" className="hover:text-gray-300 transition-colors">+220 751 6895</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
