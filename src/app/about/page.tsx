'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, TrendingUp, Target } from 'lucide-react';
import type { Metadata } from 'next';

// Simple fade-in animation
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  
  return (
    <motion.div ref={ref} style={{ opacity, y }} transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header Section */}
      <FadeIn>
        <section className="relative py-32 md:py-40 bg-gradient-to-br from-gray-950 via-red-950 to-black overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-6">
              About Us
            </h1>
            <p className="text-2xl text-red-200 leading-relaxed">
              Building brands and constructing quality signage across The Gambia since 2012.
            </p>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Story Section */}
      <FadeIn delay={0.1}>
        <section className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Story</h2>
          <div className="space-y-8 text-xl text-red-100 leading-relaxed">
            <p>
              Founded in 2012, Trust Quality Designs emerged from a simple belief: every Gambian business deserves professional branding and quality signage. Starting with a small workshop in Serrekunda, we've grown into The Gambia's trusted partner for brand identity and signage construction.
            </p>
            <p>
              We believe that great branding is more than aesthetics—it's about creating memorable impressions, building trust, and delivering quality that lasts. From brand strategy to signage construction, every project we undertake is driven by expert craftsmanship, weather-resistant materials, and a relentless commitment to excellence.
            </p>
            <p>
              Today, we've had the privilege of serving over 200 businesses across The Gambia, from Banjul's financial district to Kololi's tourist hub. Our work spans hotels, banks, supermarkets, government facilities, and retail establishments. Our greatest satisfaction comes from seeing our clients thrive with professional signage that attracts customers and builds trust.
            </p>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Values Section */}
      <FadeIn delay={0.2}>
        <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'Premium materials and expert craftsmanship in every sign we create. No compromises on quality.',
              },
              {
                title: 'Local Expertise',
                description: 'Deep understanding of Gambian climate, culture, and business environment guides our solutions.',
              },
              {
                title: 'Reliable Service',
                description: 'On-time delivery and professional installation you can count on, every single project.',
              },
              {
                title: 'Client Partnership',
                description: 'We work closely with businesses as trusted partners, supporting your growth and success.',
              },
              {
                title: 'Innovation',
                description: 'Latest signage technology and design trends adapted for The Gambian market.',
              },
              {
                title: 'Fair Pricing',
                description: 'Transparent pricing and excellent value for investment. Quality signage within your budget.',
              },
            ].map((value) => (
              <div key={value.title} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-10 border border-red-900/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all hover:scale-105">
                <h3 className="text-2xl font-bold mb-4 text-red-400">{value.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Approach Section */}
      <FadeIn delay={0.3}>
        <section className="py-20 md:py-32 bg-gradient-to-b from-black via-red-950/20 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Approach</h2>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Discover',
                description: 'We begin by deeply understanding your business, customers, and competitive landscape. Through research, interviews, and analysis, we uncover insights that shape our strategy.',
              },
              {
                number: '02',
                title: 'Define',
                description: 'With a clear understanding of the landscape, we define a strategic direction. We establish goals, success metrics, and a clear roadmap for execution.',
              },
              {
                number: '03',
                title: 'Design',
                description: 'We create innovative solutions that balance aesthetics with functionality. Our designs are informed by research and tested with users to ensure they work.',
              },
              {
                number: '04',
                title: 'Deliver',
                description: 'We bring designs to life with precision and attention to detail. Our development process ensures quality, performance, and security across all platforms.',
              },
              {
                number: '05',
                title: 'Optimize',
                description: 'After launch, we monitor performance, gather user feedback, and continuously optimize. We believe great design is never truly finished.',
              },
            ].map((step) => (
              <div key={step.number} className="flex gap-8 group hover:scale-105 transition-transform">
                <div className="flex-shrink-0">
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">{step.number}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-red-400">{step.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Awards Section */}
      <FadeIn delay={0.4}>
        <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Recognition</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              'Best Signage Company 2024',
              'Gambia Chamber of Commerce Excellence Award',
              'Top 50 Gambian Businesses',
              'Business Innovation Award',
              'Quality Service Award',
              'Client Satisfaction Leader',
              'Sustainable Business Practice',
              'Community Impact Award',
            ].map((award) => (
              <div key={award} className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-red-900/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all hover:scale-105">
                <p className="font-bold text-red-300 text-lg">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.5}>
        <section className="py-32 md:py-40 bg-gradient-to-br from-gray-950 via-red-950 to-black relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          </div>
          
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            Let's Work Together
          </h2>
          <p className="text-2xl text-red-200 mb-10 leading-relaxed">
            Interested in partnering with us? We'd love to hear about your project.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-6 bg-white text-red-600 font-black text-xl rounded-full hover:scale-110 transition-all shadow-2xl shadow-red-500/50 hover:shadow-red-500/70"
          >
            Get in Touch
          </a>
        </div>
      </section>
      </FadeIn>
    </main>
  );
}
