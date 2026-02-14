'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { TiltCard } from './TiltCard';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  featured?: boolean;
  className?: string;
}

export function BlogCard({
  id,
  title,
  slug,
  excerpt,
  publishedAt,
  featured = false,
  className,
}: BlogCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div variants={itemVariants}>
      <TiltCard
        intensity={5}
        className={cn(
          'group relative rounded-xl border border-red-800/30 bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur p-6 transition-all hover:shadow-2xl hover:shadow-red-500/40 hover:border-red-500',
          featured && 'md:col-span-2 bg-gradient-to-br from-red-900/60 to-red-950/60',
          className
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-red-400 mb-3">
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              day: 'numeric',
            })}
          </p>
          <h3 className={cn(
            'transition-colors group-hover:text-red-600',
            featured ? 'text-2xl font-bold' : 'text-xl font-semibold'
          )}>
            {title}
          </h3>
          <p className="mt-3 text-gray-600 line-clamp-2">
            {excerpt}
          </p>
        </div>

        <Link
          href={`/blog/${slug}`}
          className="mt-6 inline-flex items-center gap-2 text-red-600 font-medium hover:gap-3 transition-all"
        >
          Read Article
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      </TiltCard>
    </motion.div>
  );
}

export interface BlogGridProps {
  posts: BlogCardProps[];
  className?: string;
}

export function BlogGrid({ posts, className }: BlogGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-6',
        className
      )}
    >
      {posts.map((post) => (
        <BlogCard key={post.id} {...post} />
      ))}
    </motion.div>
  );
}
