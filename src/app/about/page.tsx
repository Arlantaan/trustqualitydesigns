import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Trust Quality',
  description: 'Award-winning branding and signage construction company creating impactful brand identities and premium signages.',
  openGraph: {
    title: 'About | Trust Quality',
    description: 'Award-winning branding and signage construction company creating impactful brand identities and premium signages.',
    type: 'website',
    url: 'https://trustquality.com/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-xl text-gray-300">
              We partner with ambitious businesses to create powerful brand identities and construct premium signages that make lasting impressions.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Founded in 2010, we started as a branding and signage company with a clear vision: to help businesses stand out with powerful brand identities and premium signage solutions. Over the years, we've become industry leaders, but our core mission remains unchanged.
            </p>
            <p>
              We believe that great branding is more than aesthetics—it's about creating memorable impressions, building trust, and delivering quality that lasts. From brand strategy to signage construction, every project we undertake is driven by craftsmanship, innovation, and a relentless commitment to excellence.
            </p>
            <p>
              Today, we've had the privilege of working with over 150 businesses across industries, from small enterprises to major corporations. Our award-winning work and premium signage installations speak for themselves, but our greatest satisfaction comes from seeing our clients succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'User-Centered',
                description: 'We put users at the heart of everything we do. Empathy and research guide our decisions.',
              },
              {
                title: 'Data-Driven',
                description: 'We believe in the power of data and analytics to inform strategy and measure success.',
              },
              {
                title: 'Innovative',
                description: 'We stay ahead of trends and constantly push boundaries to deliver cutting-edge solutions.',
              },
              {
                title: 'Collaborative',
                description: 'We work closely with our clients as true partners, not just vendors.',
              },
              {
                title: 'Accountable',
                description: 'We take responsibility for results and measure success by client outcomes.',
              },
              {
                title: 'Diverse',
                description: 'We celebrate different perspectives and backgrounds as essential to great work.',
              },
            ].map((value) => (
              <div key={value.title} className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur rounded-lg p-8 border border-red-800/30">
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Approach</h2>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Discover',
                description: 'We begin by deeply understanding your business, customers, and competitive landscape. Through research, interviews, and analysis, we uncover insights that shape our strategy.',
              },
              {
                number: '02',
                title: 'Define',
                description: 'With a clear understanding of the landscape, we define a strategic direction. We establish goals, success metrics, and a clear roadmap for execution.',
              },
              {
                number: '03',
                title: 'Design',
                description: 'We create innovative solutions that balance aesthetics with functionality. Our designs are informed by research and tested with users to ensure they work.',
              },
              {
                number: '04',
                title: 'Deliver',
                description: 'We bring designs to life with precision and attention to detail. Our development process ensures quality, performance, and security across all platforms.',
              },
              {
                number: '05',
                title: 'Optimize',
                description: 'After launch, we monitor performance, gather user feedback, and continuously optimize. We believe great design is never truly finished.',
              },
            ].map((step) => (
              <div key={step.number} className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="text-5xl font-bold text-red-600">{step.number}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-lg text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Recognition</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              'Red Dot Award',
              'Cannes Lions',
              'AIGA Design Awards',
              'WebbyAwards',
              'W3Awards',
              'CSS Design Awards',
              'Awwwards',
              'DesignRush Finalist',
            ].map((award) => (
              <div key={award} className="p-6 bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur rounded-lg border border-red-800/30">
                <p className="font-semibold text-white">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Interested in partnering with us? We'd love to hear about your project.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
}
