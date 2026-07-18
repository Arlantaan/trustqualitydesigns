import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { NewsletterForm, SectionReveal } from '@/components';
import { blogPosts, getBlogPost } from '@/data/blog';
import { SITE_URL } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Article Not Found | Trust Quality Design' };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | Trust Quality Design`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      images: [{ url: post.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-red-300 hover:text-red-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-3 text-sm text-red-300 mb-4">
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article body */}
      <article className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-10 font-light">
            {post.excerpt}
          </p>
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-lg text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-red-900/30 text-gray-400">
            Written by <span className="text-white font-semibold">{post.author}</span>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 md:py-20 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Keep Reading
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-gray-950 border border-red-900/20 hover:border-red-500/50 transition-colors"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-red-400 mb-2">{formatDate(item.publishedAt)}</p>
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/websitepics/T_Q_D_6.jpg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <SectionReveal variant="scale">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Enjoyed this article?
            </h2>
            <p className="text-xl text-red-200 mb-10">Get new signage and branding insights straight to your inbox.</p>
            <NewsletterForm />
          </div>
        </SectionReveal>
      </section>
    </main>
  );
}
