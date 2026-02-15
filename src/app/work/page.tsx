import { CaseStudyGrid } from '@/components';
import type { Metadata } from 'next';
import type { CaseStudy } from '@/types';

export const metadata: Metadata = {
  title: 'Work | Design Agency',
  description: 'Explore our portfolio of successful projects and case studies.',
  openGraph: {
    title: 'Work | Design Agency',
    description: 'Explore our portfolio of successful projects and case studies.',
    type: 'website',
    url: 'https://designagency.com/work',
  },
};

// Mock case studies - replace with database calls
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'SaaS Platform Redesign',
    tagline: 'Transforming complexity into simplicity',
    description: 'Complete redesign of a B2B SaaS platform serving 500k+ users.',
    category: { id: '1', name: 'Product Design', slug: 'product-design' },
    industry: 'Software',
    challenge: 'Complex navigation and outdated UI were causing low user satisfaction and high churn.',
    solution: 'Conducted extensive user research, rebuilt information architecture, and implemented modern design system.',
    results: ['45% increase in adoption', '3.2x faster task completion'],
    featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'],
    slug: 'saas-platform-redesign',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'E-Commerce Transformation',
    tagline: 'Building a $10M revenue stream',
    description: 'Complete redesign and development of enterprise e-commerce platform.',
    category: { id: '2', name: 'Web Development', slug: 'web-development' },
    industry: 'Retail',
    challenge: 'Legacy platform was slow, difficult to navigate, and losing sales to competitors.',
    solution: 'Built modern headless e-commerce platform with improved UX and performance.',
    results: ['$10M in first year revenue', '35% conversion rate increase'],
    featuredImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&q=80'],
    slug: 'ecommerce-transformation',
    featured: true,
    publishedAt: new Date('2023-12-20'),
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '3',
    title: 'Senegambia Beach Hotel Signage',
    tagline: 'Luxury hospitality branding and wayfinding',
    description: 'Complete signage system for premier beachfront resort in Kololi.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Hospitality',
    challenge: 'Large resort needed elegant wayfinding and strong brand presence for international guests.',
    solution: 'Custom illuminated entrance signs, directional systems, and branded interior signage.',
    results: ['30+ custom signs installed', 'Enhanced guest experience', 'Increased brand recognition'],
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'],
    slug: 'senegambia-hotel-signage',
    featured: false,
    publishedAt: new Date('2023-11-15'),
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15'),
  },
  {
    id: '4',
    title: 'Trust Bank Branch Network',
    tagline: 'Nationwide banking signage rollout',
    description: 'Comprehensive signage program for leading Gambian banking institution.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Financial Services',
    challenge: 'Inconsistent signage across 18 branches affecting brand unity and customer trust.',
    solution: 'Standardized LED signage systems, ATM enclosures, and branded interior elements.',
    results: ['18 branches completed', 'Unified visual identity', '40% faster customer navigation'],
    featuredImage: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=1200&q=80'],
    slug: 'trust-bank-signage',
    featured: false,
    publishedAt: new Date('2023-10-20'),
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-10-20'),
  },
  {
    id: '5',
    title: 'Serrekunda Market Complex',
    tagline: 'Commercial plaza branding and signage',
    description: 'Complete signage solution for Gambia\'s largest commercial market.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Retail',
    challenge: 'New market complex needed cohesive branding to attract vendors and shoppers.',
    solution: 'Monument entrance sign, tenant directories, and individual shop signage program.',
    results: ['100+ shop signs', '95% occupancy rate', 'Iconic market landmark'],
    featuredImage: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1555529902-5261145633bf?w=1200&q=80'],
    slug: 'serrekunda-market-signage',
    featured: false,
    publishedAt: new Date('2023-09-10'),
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-09-10'),
  },
  {
    id: '6',
    title: 'Quality Supermarket Rebrand',
    tagline: 'Modern retail identity for local supermarket chain',
    description: 'Brand refresh and signage upgrade for popular Gambian grocery chain.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Retail',
    challenge: 'Outdated brand image competing with new international retailers.',
    solution: 'New logo, color scheme, illuminated channel letters, and in-store graphics.',
    results: ['6 locations updated', '28% sales increase', 'Modernized brand perception'],
    featuredImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80'],
    slug: 'quality-supermarket-rebrand',
    featured: false,
    publishedAt: new Date('2023-08-15'),
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-15'),
  },
  {
    id: '7',
    title: 'Government House Wayfinding',
    tagline: 'Official signage for national government complex',
    description: 'Professional wayfinding system for government administrative buildings in Banjul.',
    category: { id: '3', name: 'Wayfinding', slug: 'wayfinding' },
    industry: 'Government',
    challenge: 'Large government complex needed clear navigation for citizens and officials.',
    solution: 'Bilingual directional signs, building identification, and ADA-compliant systems.',
    results: ['50+ directional signs', 'Improved visitor experience', 'Enhanced professionalism'],
    featuredImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80'],
    slug: 'government-house-wayfinding',
    featured: false,
    publishedAt: new Date('2023-07-20'),
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2023-07-20'),
  },
  {
    id: '8',
    title: 'Kairaba Avenue Business District',
    tagline: 'Commercial corridor branding initiative',
    description: 'Coordinated signage program for major business district in Greater Banjul.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Commercial',
    challenge: 'Mixed-use corridor needed cohesive identity while preserving individual business brands.',
    solution: 'Design guidelines, monument signs, and coordinated building signage.',
    results: ['25 businesses participated', 'Elevated district prestige', 'Increased property values'],
    featuredImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80'],
    slug: 'kairaba-avenue-district',
    featured: false,
    publishedAt: new Date('2023-06-10'),
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-10'),
  },
  {
    id: '9',
    title: 'University of The Gambia Campus',
    tagline: 'Educational institution wayfinding system',
    description: 'Comprehensive signage and wayfinding for expanding university campus.',
    category: { id: '3', name: 'Wayfinding', slug: 'wayfinding' },
    industry: 'Education',
    challenge: 'Growing campus with multiple buildings needed clear navigation for students and visitors.',
    solution: 'Campus-wide wayfinding system, building identification, and interior directionals.',
    results: ['75+ signs installed', 'Improved student experience', 'Enhanced campus image'],
    featuredImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80'],
    slug: 'university-gambia-wayfinding',
    featured: false,
    publishedAt: new Date('2023-05-15'),
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header Section */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-gray-950 via-red-950 to-black overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-6">
              Our Work
            </h1>
            <p className="text-2xl text-red-200 leading-relaxed">
              Transforming brands across The Gambia with premium signage and creative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CaseStudyGrid studies={mockCaseStudies} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-red-950 via-gray-950 to-black relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djhhNCA0IDAgMCAxLTQgNEgyMGE0IDQgMCAwIDEtNC00di04YTQgNCAwIDAgMSA0LTRoMTJhNCA0IDAgMCAxIDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { metric: '200+', label: 'Signs Delivered' },
              { metric: '50+', label: 'Business Partners' },
              { metric: '10+', label: 'Years Experience' },
              { metric: '95%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="group hover:scale-110 transition-all duration-300">
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-3">{stat.metric}</div>
                <p className="text-red-300 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Industries We Serve</h2>

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
            ].map((industry) => (
              <div
                key={industry}
                className="px-8 py-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900/30 rounded-2xl hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all text-center text-red-200 font-semibold hover:scale-105 hover:bg-gradient-to-br hover:from-red-950 hover:to-gray-950"
              >
                {industry}
              </div>
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
            Start Your Project
          </a>
        </div>
      </section>
    </main>
  );
}
