import { BlogGrid } from '@/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Design Agency',
  description: 'Insights, trends, and best practices in design and digital strategy.',
  openGraph: {
    title: 'Blog | Design Agency',
    description: 'Insights, trends, and best practices in design and digital strategy.',
    type: 'website',
    url: 'https://designagency.com/blog',
  },
};

// Mock blog posts - replace with database calls
const mockBlogPosts = [
  {
    id: '1',
    title: 'The Future of Design Systems',
    slug: 'the-future-of-design-systems',
    excerpt: 'Exploring emerging trends in design system architecture and implementation strategies.',
    publishedAt: new Date('2024-01-20'),
    featured: true,
  },
  {
    id: '2',
    title: 'Building Accessible Web Experiences',
    slug: 'building-accessible-web-experiences',
    excerpt: 'Best practices for creating inclusive digital products that serve all users.',
    publishedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    title: 'The Art of Effective Copywriting',
    slug: 'the-art-of-effective-copywriting',
    excerpt: 'How words and design work together to create compelling user experiences.',
    publishedAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    title: 'Color Psychology in Branding',
    slug: 'color-psychology-in-branding',
    excerpt: 'Understanding how colors influence perception and drive brand recognition.',
    publishedAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    title: 'Mobile-First Design Principles',
    slug: 'mobile-first-design-principles',
    excerpt: 'Designing for mobile devices first creates better experiences for everyone.',
    publishedAt: new Date('2023-12-28'),
  },
  {
    id: '6',
    title: 'Microinteractions That Matter',
    slug: 'microinteractions-that-matter',
    excerpt: 'Small details that create delightful and intuitive user interfaces.',
    publishedAt: new Date('2023-12-20'),
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600">
              Insights, trends, and best practices in design, technology, and digital strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={mockBlogPosts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Get the latest insights delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
