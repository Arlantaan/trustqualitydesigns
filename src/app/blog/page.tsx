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
              Blog
            </h1>
            <p className="text-2xl text-red-200 leading-relaxed">
              Insights, trends, and best practices in design, technology, and digital strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={mockBlogPosts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 bg-gradient-to-br from-gray-950 via-red-950 to-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-2xl text-red-200 mb-10 leading-relaxed">
            Get the latest insights delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 rounded-full bg-gray-900 text-red-100 placeholder-gray-500 border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
            />
            <button className="px-8 py-4 bg-white text-red-600 font-black rounded-full hover:scale-110 transition-all shadow-xl shadow-red-500/50">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
