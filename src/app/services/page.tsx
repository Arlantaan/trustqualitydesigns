import { ServiceGrid } from '@/components';
import type { Metadata } from 'next';
import type { ServiceOffering } from '@/types';

export const metadata: Metadata = {
  title: 'Services | Trust Quality',
  description: 'Professional branding services and premium signage construction - from brand identity to custom signs.',
  openGraph: {
    title: 'Services | Trust Quality',
    description: 'Professional branding services and premium signage construction - from brand identity to custom signs.',
    type: 'website',
    url: 'https://trustquality.com/services',
  },
};

// Mock services - replace with database calls
const mockServices: ServiceOffering[] = [
  {
    id: '1',
    name: 'Brand Identity Design',
    slug: 'brand-identity',
    description: 'Complete brand identity systems including logo, colors, typography, and brand guidelines.',
    icon: 'Target',
    features: ['logo design', 'brand guidelines', 'color palette', 'typography system', 'brand collateral'],
  },
  {
    id: '2',
    name: 'Channel Letter Signs',
    slug: 'channel-letters',
    description: 'Premium illuminated channel letters for storefronts and building facades.',
    icon: 'Palette',
    features: ['LED illumination', 'custom fonts', 'aluminum construction', 'weather resistant', 'installation'],
  },
  {
    id: '3',
    name: 'Monument & Pylon Signs',
    slug: 'monument-signs',
    description: 'Ground-mounted monument signs and tall pylon signs for maximum visibility.',
    icon: 'Trending Up',
    features: ['custom design', 'LED cabinets', 'stone or metal finish', 'landscaping integration', 'permits'],
  },
  {
    id: '4',
    name: 'Wayfinding Systems',
    slug: 'wayfinding',
    description: 'Comprehensive directional and informational signage for campuses and facilities.',
    icon: 'Code',
    features: ['site analysis', 'sign family design', 'ADA compliance', 'material selection', 'installation'],
  },
  {
    id: '5',
    name: 'Vehicle Graphics & Wraps',
    slug: 'vehicle-graphics',
    description: 'Eye-catching vehicle wraps and graphics that turn your fleet into mobile billboards.',
    icon: 'FileText',
    features: ['custom design', 'full wraps', 'partial graphics', 'fleet branding', 'professional installation'],
  },
  {
    id: '6',
    name: 'Interior Signage',
    slug: 'interior-signage',
    description: 'Professional interior signs including directories, room IDs, and branded environments.',
    icon: 'BarChart3',
    features: ['lobby signs', 'dimensional letters', 'ADA signage', 'acrylic displays', 'wall graphics'],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Services
            </h1>
            <p className="text-xl text-gray-300">
              Professional branding and custom signage solutions that elevate your business presence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceGrid services={mockServices} />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Process</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Consultation', description: 'Understanding your brand vision and signage requirements.' },
              { number: '02', title: 'Design', description: 'Creating custom designs that reflect your brand identity.' },
              { number: '03', title: 'Fabrication', description: 'Building premium signs with quality materials and craftsmanship.' },
              { number: '04', title: 'Installation', description: 'Professional installation and ongoing support.' },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-5xl font-bold text-red-400 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Let's discuss your branding and signage needs.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
          >
            Schedule a Consultation
          </a>
        </div>
      </section>
    </main>
  );
}
