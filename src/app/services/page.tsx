'use client';

import { ServiceGrid } from '@/components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle, Award, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import type { ServiceOffering } from '@/types';

// Simple fade-in animation component
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

// Mock services - replace with database calls
const mockServices: ServiceOffering[] = [
  {
    id: '1',
    name: 'Brand Identity Design',
    slug: 'brand-identity',
    description: 'Complete brand identity systems including logo, colors, typography, and brand guidelines.',
    icon: 'Target',
    features: ['logo design', 'brand guidelines', 'color palette', 'typography system', 'brand collateral'],
  },
  {
    id: '2',
    name: 'Channel Letter Signs',
    slug: 'channel-letters',
    description: 'Premium illuminated channel letters for storefronts and building facades.',
    icon: 'Palette',
    features: ['LED illumination', 'custom fonts', 'aluminum construction', 'weather resistant', 'installation'],
  },
  {
    id: '3',
    name: 'Monument & Pylon Signs',
    slug: 'monument-signs',
    description: 'Ground-mounted monument signs and tall pylon signs for maximum visibility.',
    icon: 'Trending Up',
    features: ['custom design', 'LED cabinets', 'stone or metal finish', 'landscaping integration', 'permits'],
  },
  {
    id: '4',
    name: 'Wayfinding Systems',
    slug: 'wayfinding',
    description: 'Comprehensive directional and informational signage for campuses and facilities.',
    icon: 'Code',
    features: ['site analysis', 'sign family design', 'ADA compliance', 'material selection', 'installation'],
  },
  {
    id: '5',
    name: 'Vehicle Graphics & Wraps',
    slug: 'vehicle-graphics',
    description: 'Eye-catching vehicle wraps and graphics that turn your fleet into mobile billboards.',
    icon: 'FileText',
    features: ['custom design', 'full wraps', 'partial graphics', 'fleet branding', 'professional installation'],
  },
  {
    id: '6',
    name: 'Interior Signage',
    slug: 'interior-signage',
    description: 'Professional interior signs including directories, room IDs, and branded environments.',
    icon: 'BarChart3',
    features: ['lobby signs', 'dimensional letters', 'ADA signage', 'acrylic displays', 'wall graphics'],
  },
];

export default function ServicesPage() {
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
                Our Services
              </h1>
              <p className="text-2xl text-red-200 leading-relaxed">
                Premium branding and signage solutions that transform your business presence.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Why Choose Us */}
      <FadeIn delay={0.1}>
        <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Why Choose Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Award, title: 'Award-Winning Excellence', description: 'Recognized for outstanding branding and signage construction across The Gambia.' },
                { icon: Users, title: 'Expert Craftsmen', description: 'Skilled designers and builders dedicated to bringing your vision to life with precision.' },
                { icon: Zap, title: 'Fast Turnaround', description: 'Efficient delivery times without compromising on quality or attention to detail.' },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-3xl border border-red-900/30 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105">
                  <item.icon className="w-14 h-14 text-red-500 mb-6" />
                  <h3 className="text-2xl font-bold text-red-400 mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Services Grid */}
      <FadeIn delay={0.2}>
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">What We Offer</h2>
            <ServiceGrid services={mockServices} />
          </div>
        </section>
      </FadeIn>

      {/* Process Section */}
      <FadeIn delay={0.3}>
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-black relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">How We Work</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { number: '01', title: 'Consultation', description: 'Free consultation to understand your brand vision and signage requirements.' },
                { number: '02', title: 'Design', description: 'Custom design concepts that perfectly reflect your brand identity and goals.' },
                { number: '03', title: 'Fabrication', description: 'Premium sign construction using quality materials and expert craftsmanship.' },
                { number: '04', title: 'Installation', description: 'Professional installation with ongoing maintenance and support services.' },
              ].map((step) => (
                <div key={step.number} className="text-center group">
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-700 mb-6 group-hover:scale-125 transition-transform duration-300">{step.number}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-400">{step.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.4}>
        <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTZ2OGE0IDQgMCAwIDEtNCA0SDIwYTQgNCAwIDAgMS00LTR2LThhNCA0IDAgMCAxIDQtNGgxMmE0IDQgMCAwIDEgNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Elevate Your Brand?
            </h2>
            <p className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let's discuss your branding and signage needs. Get a free consultation today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-10 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-gray-100 hover:shadow-2xl transition-all hover:scale-105"
              >
                Schedule Consultation
              </a>
              <a
                href="/work"
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-red-600 transition-all hover:scale-105"
              >
                View Our Work
              </a>
            </div>
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-red-400/30">
              {[
                { icon: CheckCircle, text: 'Free Consultation' },
                { icon: CheckCircle, text: 'Quality Guarantee' },
                { icon: CheckCircle, text: 'Timely Delivery' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-3">
                  <item.icon className="w-6 h-6" />
                  <span className="font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
