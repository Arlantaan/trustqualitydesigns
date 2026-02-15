'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: Date;
  category: 'project' | 'award' | 'news' | 'event';
  image?: string;
  featured?: boolean;
}

interface NewsUpdatesProps {
  items: NewsItem[];
  title?: string;
  subtitle?: string;
}

export function NewsUpdates({ 
  items, 
  title = "Latest Updates",
  subtitle = "Stay connected with our recent projects, achievements, and company news"
}: NewsUpdatesProps) {
  
  const getCategoryBadge = (category: string) => {
    const badges = {
      project: { label: 'New Project', color: 'border border-gray-700 text-gray-400' },
      award: { label: 'Award', color: 'border border-gray-700 text-gray-400' },
      news: { label: 'Company News', color: 'border border-gray-700 text-gray-400' },
      event: { label: 'Event', color: 'border border-gray-700 text-gray-400' },
    };
    return badges[category as keyof typeof badges] || badges.news;
  };

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <TrendingUp className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-[0.3em]">
              Marketing Hub
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const badge = getCategoryBadge(item.category);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className={`group relative h-full ${item.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link href={`/news/${item.id}`} className="h-full block">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-500 h-full flex flex-col">
                    {/* Image Section */}
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className={`absolute top-4 left-4 ${badge.color} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                          {badge.label}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={item.date.toISOString()}>
                            {item.date.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </time>
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-white mb-3 group-hover:text-gray-300 transition-colors line-clamp-2 ${item.featured ? 'text-3xl' : 'text-xl'}`}>
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>

                      {/* Read More Link */}
                      <div className="flex items-center gap-2 text-red-400 font-semibold group-hover:gap-4 transition-all mt-4">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* No hover effects */}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/news"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 border-2 border-gray-700 text-white font-bold rounded-full hover:border-white hover:shadow-lg transition-all duration-300 group"
          >
            <span>View All Updates</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
