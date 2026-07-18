'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { CaseStudy } from '@/types';
import { cn } from '@/utils';
import { TiltCard } from './TiltCard';

interface CaseStudyCardProps {
  study: CaseStudy;
  featured?: boolean;
}

export function CaseStudyCard({ study, featured = false }: CaseStudyCardProps) {
  const mediaAspectClass = 'aspect-[1.618/1]';

  // Inner parallax tracking (desktop hover only)
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const imgX = useSpring(rawX, { damping: 30, stiffness: 200 });
  const imgY = useSpring(rawY, { damping: 30, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    rawX.set(dx * -18); // image moves opposite to cursor
    rawY.set(dy * -18);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div className="h-full">
      <TiltCard intensity={8}>
        <Link href={`/work/${study.slug}`} aria-label={`View project: ${study.title}`}>
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'group relative overflow-hidden phi-card transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/30 bg-black/60 triangle-frame cursor-pointer',
              featured ? 'mb-12 ring-2 ring-red-500/50' : 'ring-1 ring-red-500/15'
            )}
          >
            {/* Media Container */}
            <div className={cn('relative overflow-hidden bg-gray-950', mediaAspectClass)}>
              {study.featuredVideo ? (
                <video
                  src={study.featuredVideo}
                  poster={study.videoThumbnail}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <motion.div
                  style={{ x: imgX, y: imgY, scale: 1.08 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={study.featuredImage}
                    alt={study.title}
                    fill
                    priority={featured}
                    className="object-cover"
                  />
                </motion.div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-red-500/20" />

              {/* Title overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 translate-y-0">
                {study.category?.name && (
                  <span className="inline-block mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-red-300/90 font-semibold">
                    {study.category.name}
                  </span>
                )}
                <h3 className={cn('font-bold text-white leading-tight', featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl')}>
                  {study.title}
                </h3>
                {study.tagline && (
                  <p className="mt-1 text-sm text-gray-300 line-clamp-1">{study.tagline}</p>
                )}
              </div>
            </div>

          </motion.div>
        </Link>
      </TiltCard>
    </div>
  );
}

interface CaseStudyGridProps {
  studies: CaseStudy[];
  featured?: CaseStudy;
}

export function CaseStudyGrid({ studies, featured }: CaseStudyGridProps) {
  return (
    <div className="space-y-8">
      {/* Featured Project */}
      {featured && (
        <div className="mb-16">
          <CaseStudyCard study={featured} featured />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {studies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}
