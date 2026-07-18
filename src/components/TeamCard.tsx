'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';
import { cn } from '@/utils';
import type { TeamMember } from '@/types';
import { TiltCard } from './TiltCard';

interface TeamCardProps extends TeamMember {
  className?: string;
}

export function TeamCard({
  name,
  position,
  avatar,
  bio,
  socialLinks,
  className,
}: TeamCardProps) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div variants={itemVariants} className="h-full">
      <TiltCard
        intensity={7}
        className={cn(
          'group rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur border border-red-800/30 hover:shadow-2xl hover:shadow-red-500/40 hover:border-red-500 transition-all h-full flex flex-col',
          className
        )}
      >
      <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-red-950 to-gray-950 flex items-center justify-center">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-6xl md:text-7xl tracking-widest text-red-300/80 select-none">
            {initials}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
            {name}
          </h3>
          <p className="text-sm font-medium text-red-400 mt-1">{position}</p>
          <p className="text-sm text-gray-300 mt-3 line-clamp-2">{bio}</p>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="flex gap-3 mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
      </TiltCard>
    </motion.div>
  );
}

interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

export function TeamGrid({ members, className }: TeamGridProps) {
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
      {members.map((member) => (
        <TeamCard key={member.id} {...member} />
      ))}
    </motion.div>
  );
}
