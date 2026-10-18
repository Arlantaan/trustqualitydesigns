import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Services | Trust Quality Design',
  description:
    'Signboards, 3D letters, totem and pylon signs, billboards, banners, printing, branded merchandise and vehicle branding — made and installed in The Gambia.',
  alternates: { canonical: '/services' },
};

// Services come from src/data/services.ts, the single list shared with the
// homepage. This page previously carried its own array marked "Mock services"
// that disagreed with the homepage and with /api/services; all three are now
// one list taken from TQD's own service poster.
//
// Removed from this page deliberately:
//   - "Why Choose Us" with an Award-Winning Excellence claim nothing supports
//   - a four-step process block duplicating the homepage word for word
//   - gradient-filled headings used nowhere else on the site
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="What we make"
        subtitle="Signs, print and branded items — designed, produced and installed by our own team."
        image="/images/websitepics/T_Q_D_12.jpg"
      />

      <section className="py-[var(--space-5)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-[var(--space-3)] gap-y-[var(--space-4)]">
            {services.map((s) => (
              <li key={s.slug}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h2 className="mt-4 font-display text-2xl text-white">{s.name}</h2>
                <p className="mt-1 text-gray-400 leading-relaxed">{s.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-gray-300 border border-white/15 rounded-full px-3 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-[var(--space-5)] bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white mb-2">
              Not sure which you need?
            </h2>
            <p className="text-gray-300 max-w-xl">
              Tell us what the sign is for and where it&apos;s going. We&apos;ll come out,
              measure up and quote.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center justify-center px-7 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-colors"
          >
            Get a quote
          </Link>
        </div>
      </section>
    </main>
  );
}
