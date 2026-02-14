import { Hero, CaseStudyGrid, ShatterText } from '@/components';

// Mock case studies - replace with API data
const mockCaseStudies = [
  {
    id: '1',
    title: 'Corporate Campus Signage',
    tagline: 'Premium architectural signage system',
    description: 'Complete wayfinding and branding installation for Fortune 500 headquarters.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Corporate',
    challenge: 'Large campus needed cohesive wayfinding and brand presence',
    solution: 'Custom LED signage, directional systems, and monument signs',
    results: ['50+ custom signs installed', 'Enhanced brand visibility', 'Improved visitor navigation'],
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'],
    slug: 'corporate-campus-signage',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Retail Brand Identity',
    tagline: 'Complete brand transformation with storefront signage',
    description: 'Brand redesign and premium signage for boutique retail chain.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Retail',
    challenge: 'Outdated brand identity and inconsistent signage across locations',
    solution: 'New brand guidelines with custom illuminated channel letters and window graphics',
    results: ['35% increase in foot traffic', 'Unified brand presence across 12 locations'],
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'],
    slug: 'retail-brand-identity',
    featured: false,
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export default function Home() {
  const featuredStudy = mockCaseStudies.find((s) => s.featured);
  const otherStudies = mockCaseStudies.filter((s) => !s.featured);

  return (
    <>
      <Hero
        title="Building Brands That Stand Out"
        description="We create powerful brand identities and construct premium signages that elevate your business presence."
        cta={{ label: 'Explore Our Work', href: '/work' }}
      />

      {/* Work Section */}
      <section className="py-32 bg-gradient-to-b from-gray-950 via-red-950 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20 text-center">
            <ShatterText className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-red-400 via-red-300 to-red-200 text-transparent bg-clip-text">
              Work we&apos;re proud of
            </ShatterText>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore our latest projects showcasing creativity and innovation
            </p>
          </div>
          <CaseStudyGrid studies={otherStudies} featured={featuredStudy} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-br from-gray-950 via-red-950 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djhhNCA0IDAgMCAxLTQgNEgyMGE0IDQgMCAwIDEtNC00di04YTQgNCAwIDAgMSA0LTRoMTJhNCA0IDAgMCAxIDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { number: '150+', label: 'Projects Delivered', icon: '🚀' },
              { number: '85%', label: 'Client Retention', icon: '💼' },
              { number: '2.5B+', label: 'Users Impacted', icon: '👥' },
              { number: '12', label: 'Design Awards', icon: '🏆' },
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl mb-4">{stat.icon}</div>
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-transparent bg-clip-text mb-4 drop-shadow-2xl">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
