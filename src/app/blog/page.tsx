import { BlogGrid, PageHero, SectionReveal, NewsletterForm } from '@/components';
import type { Metadata } from 'next';
import { blogPosts as mockBlogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog | Trust Quality Design',
  description: 'Insights on branding, signage construction, and growing your business presence in The Gambia.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Trust Quality Design',
    description: 'Insights on branding, signage construction, and growing your business presence in The Gambia.',
    type: 'website',
    url: 'https://trustqualitydesign.com/blog',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="Blog"
        subtitle="Insights on branding, signage, and building a stronger business presence."
        image="/images/websitepics/T_Q_D_17.jpg"
      />

      {/* Blog Posts Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={mockBlogPosts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/websitepics/T_Q_D_6.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <SectionReveal variant="scale">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-2xl text-red-200 mb-10 leading-relaxed">
            Get signage tips, branding insights, and TQD project updates delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
        </SectionReveal>
      </section>
    </main>
  );
}
