'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CaseStudy } from '@/types';
import { cn } from '@/utils';
import { TiltCard } from './TiltCard';
import { GyroscopeTilt } from './GyroscopeTilt';

interface CaseStudyCardProps {
  study: CaseStudy;
  featured?: boolean;
}

export function CaseStudyCard({ study, featured = false }: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <TiltCard intensity={8}>
        <Link href={`/work/${study.slug}`}>
          <div
            className={cn(
              'group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/30',
              featured ? 'mb-12 ring-2 ring-red-500/50' : ''
            )}
          >
            {/* Media Container */}
            <GyroscopeTilt intensity={20} className={cn('relative overflow-hidden bg-gray-900', featured ? 'aspect-video' : 'aspect-square')}>
              {study.featuredVideo ? (
                <video
                  src={study.featuredVideo}
                  poster={study.videoThumbnail}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={study.featuredImage}
                  alt={study.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
            </GyroscopeTilt>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="inline-block bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {study.category.name}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-red-200 transition-colors">{study.title}</h3>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 group-hover:text-gray-200 transition-colors">{study.tagline}</p>
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {studies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}
