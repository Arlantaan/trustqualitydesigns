import Link from 'next/link';
import { CaseStudyGrid, PageHero, SectionReveal } from '@/components';
import type { Metadata } from 'next';
import { caseStudies as mockCaseStudies } from '@/data/caseStudies';

export const metadata: Metadata = {
  title: 'Our Work | Trust Quality Design',
  description: 'Explore our portfolio of signage construction and branding projects across The Gambia.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Our Work | Trust Quality Design',
    description: 'Explore our portfolio of signage construction and branding projects across The Gambia.',
    type: 'website',
    url: 'https://trustqualitydesign.com/work',
  },
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="Our Work"
        subtitle="Transforming brands across The Gambia with premium signage and creative solutions."
        image="/images/websitepics/T_Q_D_20.jpg"
      />

      {/* Case Studies Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CaseStudyGrid studies={mockCaseStudies} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { metric: '200+', label: 'Signs Delivered' },
              { metric: '50+', label: 'Business Partners' },
              { metric: '10+', label: 'Years Experience' },
              { metric: '95%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <SectionReveal key={stat.label} variant="elevate" delay={i * 0.1}>
              <div className="group hover:scale-110 transition-all duration-300">
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-3">{stat.metric}</div>
                <p className="text-red-300 text-lg font-medium">{stat.label}</p>
              </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal variant="fade">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Industries We Serve</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Hospitality & Tourism',
              'Financial Services',
              'Retail & Supermarkets',
              'Healthcare',
              'Education',
              'Government',
              'Real Estate',
              'Restaurant & Food',
              'Professional Services',
            ].map((industry, i) => (
              <SectionReveal key={industry} variant="scale" delay={i * 0.05}>
              <Link
                href="/contact"
                aria-label={`Discuss a ${industry} project`}
                className="block px-8 py-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900/30 rounded-2xl hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all text-center text-red-200 font-semibold hover:scale-105 hover:bg-gradient-to-br hover:from-red-950 hover:to-gray-950"
              >
                {industry}
              </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-red-950 via-red-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
            Ready to Transform Your Brand?
          </h2>
          <p className="text-2xl text-red-100 mb-12 leading-relaxed">
            Let's create something extraordinary together.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-5 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-red-50 hover:shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-110"
          >
            Book a Consultation
          </a>
        </div>
      </section>
    </main>
  );
}
