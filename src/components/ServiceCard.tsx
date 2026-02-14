'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import type { ServiceOffering } from '@/types';
import { TiltCard } from './TiltCard';

interface ServiceCardProps extends ServiceOffering {
  className?: string;
}

export function ServiceCard({
  slug,
  name,
  description,
  features,
  className,
}: ServiceCardProps) {
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
        intensity={6}
        className={cn(
          'group relative rounded-xl border border-red-800/30 bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-sm p-8 hover:shadow-2xl hover:shadow-red-500/40 hover:border-red-500 transition-all',
          className
        )}
      >
        <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition-colors">
          {name}
        </h3>
      <p className="mt-3 text-gray-300">{description}</p>

      {features && features.length > 0 && (
        <ul className="mt-6 space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/services/${slug}`}
        className="mt-6 inline-flex items-center gap-2 text-red-600 font-medium hover:gap-3 transition-all"
      >
        Learn More
        <ArrowRight className="w-4 h-4" />
      </Link>
      </TiltCard>
    </motion.div>
  );
}

interface ServiceGridProps {
  services: ServiceOffering[];
  className?: string;
}

export function ServiceGrid({ services, className }: ServiceGridProps) {
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
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {services.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </motion.div>
  );
}
