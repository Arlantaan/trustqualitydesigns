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
    title: 'Brand Revitalization',
    tagline: 'Refreshing a legacy tech brand',
    description: 'Strategic brand refresh and complete visual identity redesign.',
    category: { id: '3', name: 'Brand Strategy', slug: 'brand-strategy' },
    industry: 'Enterprise Tech',
    challenge: 'Outdated brand perception was limiting market opportunities and client engagement.',
    solution: 'Developed new strategic positioning, visual identity, and brand guidelines.',
    results: ['25% increase in brand perception', 'Enabled market expansion'],
    featuredImage: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80'],
    slug: 'brand-revitalization',
    featured: false,
    publishedAt: new Date('2023-11-15'),
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15'),
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Work
            </h1>
            <p className="text-xl text-gray-300">
              Explore our portfolio of successful branding and signage projects.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CaseStudyGrid studies={mockCaseStudies} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { metric: '150+', label: 'Projects Completed' },
              { metric: '85', label: 'Industry Awards' },
              { metric: '$2.5B', label: 'Client Revenue Impact' },
              { metric: '12y', label: 'Customer Retention Avg' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-bold text-red-600 mb-2">{stat.metric}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Industries We Serve</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Technology',
              'Financial Services',
              'E-Commerce',
              'Healthcare',
              'Media & Publishing',
              'Enterprise Software',
            ].map((industry) => (
              <div
                key={industry}
                className="px-6 py-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-red-500 transition-all text-center"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Let's discuss your next project and how we can help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
          >
            Start a Project
          </a>
        </div>
      </section>
    </main>
  );
}
