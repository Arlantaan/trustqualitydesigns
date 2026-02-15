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
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-xl text-gray-300">
              We partner with ambitious businesses to create powerful brand identities and construct premium signages that make lasting impressions.
            </p>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Story Section */}
      <FadeIn delay={0.1}>
        <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600">
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
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={value.title} className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur rounded-lg p-8 border border-red-800/30">
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Approach Section */}
      <FadeIn delay={0.3}>
        <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Approach</h2>

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
              <div key={step.number} className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="text-5xl font-bold text-red-600">{step.number}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-lg text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Awards Section */}
      <FadeIn delay={0.4}>
        <section className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Recognition</h2>

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
              <div key={award} className="p-6 bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur rounded-lg border border-red-800/30">
                <p className="font-semibold text-white">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.5}>
        <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Interested in partnering with us? We'd love to hear about your project.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>
      </FadeIn>
    </main>
  );
}
