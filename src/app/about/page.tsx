import type { Metadata } from 'next';
import { PageHero, SectionReveal } from '@/components';

export const metadata: Metadata = {
  title: 'About | Trust Quality Design',
  description: 'Building brands and constructing quality signage across The Gambia since 2012.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="About Us"
        subtitle="Building brands and constructing quality signage across The Gambia since 2012."
        image="/images/websitepics/T_Q_D_15.jpg"
      />

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal variant="slideLeft">
            <h2 className="text-5xl md:text-6xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Story</h2>
          </SectionReveal>
          <SectionReveal variant="fade" delay={0.1}>
          <div className="space-y-8 text-xl text-red-100 leading-relaxed">
            <p>
              Founded in 2012, Trust Quality Design emerged from a simple belief: every Gambian business deserves professional branding and quality signage. Starting with a small workshop in Serrekunda, we've grown into The Gambia's trusted partner for brand identity and signage construction.
            </p>
            <p>
              We believe that great branding is more than aesthetics—it's about creating memorable impressions, building trust, and delivering quality that lasts. From brand strategy to signage construction, every project we undertake is driven by expert craftsmanship, weather-resistant materials, and a relentless commitment to excellence.
            </p>
            <p>
              Today, we've had the privilege of serving over 200 businesses across The Gambia, from Banjul's financial district to Kololi's tourist hub. Our work spans hotels, banks, supermarkets, government facilities, and retail establishments. Our greatest satisfaction comes from seeing our clients thrive with professional signage that attracts customers and builds trust.
            </p>
          </div>
          </SectionReveal>
        </div>
      </section>
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal variant="scale">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Values</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {[
              {
                title: 'Quality First',
                description: 'Premium materials and expert craftsmanship in every sign we create. No compromises on quality.',
              },
              {
                title: 'Local Expertise',
                description: 'Deep understanding of Gambian climate, culture, and business environment guides our solutions.',
              },
              {
                title: 'Reliable Service',
                description: 'On-time delivery and professional installation you can count on, every single project.',
              },
              {
                title: 'Client Partnership',
                description: 'We work closely with businesses as trusted partners, supporting your growth and success.',
              },
              {
                title: 'Innovation',
                description: 'Latest signage technology and design trends adapted for The Gambian market.',
              },
              {
                title: 'Fair Pricing',
                description: 'Transparent pricing and excellent value for investment. Quality signage within your budget.',
              },
            ].map((value, i) => (
              <SectionReveal key={value.title} variant="elevate" delay={i * 0.08}>
              <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-10 border border-red-900/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all hover:scale-105 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-red-400">{value.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
              </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black via-red-950/20 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Approach</h2>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Discover',
                description: 'We start by understanding your business, your customers, and the site itself — location, sightlines, lighting, and local regulations — so the signage we plan works where it will actually live.',
              },
              {
                number: '02',
                title: 'Define',
                description: 'We agree the scope, materials, timeline, and budget, then produce a clear plan and quotation so you know exactly what will be built and when.',
              },
              {
                number: '03',
                title: 'Design',
                description: 'Our designers develop concepts and production-ready artwork, balancing your brand identity with legibility, scale, and the realities of fabrication.',
              },
              {
                number: '04',
                title: 'Build & Install',
                description: 'We fabricate your signage in-house with quality, weather-resistant materials, then install it safely and professionally on site.',
              },
              {
                number: '05',
                title: 'Support',
                description: 'After installation we stay involved — with maintenance, repairs, and updates that keep your signage looking sharp for years.',
              },
            ].map((step, i) => (
              <SectionReveal key={step.number} variant="slideLeft" delay={i * 0.1}>
              <div className="flex gap-8 group hover:scale-105 transition-transform">
                <div className="flex-shrink-0">
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">{step.number}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-red-400">{step.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

