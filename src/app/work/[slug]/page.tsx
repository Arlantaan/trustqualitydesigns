import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SectionReveal } from '@/components';
import { caseStudies, getCaseStudy } from '@/data/caseStudies';
import { SITE_URL } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return { title: 'Project Not Found | Trust Quality Design' };
  }

  const url = `${SITE_URL}/work/${study.slug}`;
  return {
    title: `${study.title} | Trust Quality Design`,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${study.title} | Trust Quality Design`,
      description: study.description,
      type: 'article',
      url,
      images: [{ url: study.featuredImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description: study.description,
      images: [study.featuredImage],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const related = caseStudies.filter((cs) => cs.slug !== study.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src={study.featuredImage}
          alt={study.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-red-300 hover:text-red-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Work
          </Link>
          <span className="inline-block mb-3 text-xs uppercase tracking-[0.25em] text-red-400 font-semibold">
            {study.category?.name} · {study.industry}
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
            {study.title}
          </h1>
          {study.tagline && (
            <p className="mt-4 text-xl md:text-2xl text-red-100/90">{study.tagline}</p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SectionReveal variant="fade">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">{study.description}</p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <SectionReveal variant="elevate">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900/30">
                <h2 className="text-sm uppercase tracking-[0.2em] text-red-400 font-semibold mb-4">The Challenge</h2>
                <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
              </div>
            </SectionReveal>
            <SectionReveal variant="elevate" delay={0.1}>
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900/30">
                <h2 className="text-sm uppercase tracking-[0.2em] text-red-400 font-semibold mb-4">Our Solution</h2>
                <p className="text-gray-300 leading-relaxed">{study.solution}</p>
              </div>
            </SectionReveal>
          </div>

          {study.results?.length > 0 && (
            <SectionReveal variant="fade">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  The Results
                </h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {study.results.map((result) => (
                    <li
                      key={result}
                      className="flex items-start gap-3 p-5 rounded-xl bg-gray-950 border border-red-900/20"
                    >
                      <Check className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-200">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          )}

          {study.testimonial && (
            <SectionReveal variant="scale">
              <blockquote className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-950/60 to-gray-950 border border-red-900/30">
                <p className="text-xl md:text-2xl text-red-100 italic leading-relaxed">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </p>
                <footer className="mt-6 text-gray-300">
                  <span className="font-semibold text-white">{study.testimonial.author}</span>
                  {study.testimonial.role && <span> — {study.testimonial.role}</span>}
                </footer>
              </blockquote>
            </SectionReveal>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              More Projects
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/work/${item.slug}`}
                  className="group relative block aspect-[1.618/1] rounded-2xl overflow-hidden ring-1 ring-red-500/20"
                >
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-red-950 via-red-900 to-black text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
            Have a project in mind?
          </h2>
          <p className="text-xl text-red-100 mb-10">Let&apos;s build something your customers won&apos;t forget.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-red-50 hover:scale-105 transition-all"
          >
            Book a Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
