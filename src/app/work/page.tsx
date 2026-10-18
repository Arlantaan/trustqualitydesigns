import Link from 'next/link';
import type { Metadata } from 'next';
import { CaseStudyGrid, PageHero } from '@/components';
import { caseStudies } from '@/data/caseStudies';

export const metadata: Metadata = {
  title: 'Our Work | Trust Quality Design',
  description:
    'Signage, billboards, printing and vehicle branding delivered for businesses, banks and government across The Gambia.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Our Work | Trust Quality Design',
    description:
      'Signage, billboards, printing and vehicle branding delivered across The Gambia.',
    url: 'https://trustqualitydesign.com/work',
  },
};

// The page is the project grid and nothing else. Removed:
//
// - "Industries We Serve": nine tiles (Hospitality, Financial Services,
//   Healthcare, Education...) that every one of them linked to /contact. No
//   content, no proof, a full screen of scrolling to say nothing.
// - A stats block reading 200+ Signs / 50+ Partners / 10+ Years / 95% Client
//   Satisfaction. Those contradicted the homepage's 220+ installations, 60+
//   clients and Since 2012, and "95% Client Satisfaction" was not measured
//   anywhere. The homepage credentials strip is the single place for these.
// - hover:scale-110 on full-width tiles, which on a one-column phone layout
//   grows an element past the viewport and produces horizontal scroll on tap.
// - Gradient-filled headings used nowhere else on the site.
export default function WorkPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="Our Work"
        subtitle="Signs, billboards and vehicle branding built for businesses across The Gambia."
        image="/images/websitepics/T_Q_D_7.jpg"
      />

      <section className="py-[var(--space-5)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <CaseStudyGrid studies={caseStudies} />
        </div>
      </section>

      <section className="py-[var(--space-5)] bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white mb-2">
              Want something like this?
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
