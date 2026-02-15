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
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                Our Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Professional branding and premium signage solutions that elevate your business presence across The Gambia.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Why Choose Us */}
      <FadeIn delay={0.1}>
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Why Choose Trust Quality Designs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Award, title: 'Award-Winning', description: 'Recognized for excellence in branding and signage construction across The Gambia.' },
                { icon: Users, title: 'Expert Team', description: 'Skilled designers and craftsmen dedicated to bringing your vision to life with precision.' },
                { icon: Zap, title: 'Fast Delivery', description: 'Efficient turnaround times without compromising on quality or craftsmanship.' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-red-500 transition-all duration-300">
                  <item.icon className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Services Grid */}
      <FadeIn delay={0.2}>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Our Service Offerings</h2>
            <ServiceGrid services={mockServices} />
          </div>
        </section>
      </FadeIn>

      {/* Process Section */}
      <FadeIn delay={0.3}>
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Our Process</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '01', title: 'Consultation', description: 'Free consultation to understand your brand vision and signage requirements.' },
                { number: '02', title: 'Design', description: 'Custom design concepts that perfectly reflect your brand identity and goals.' },
                { number: '03', title: 'Fabrication', description: 'Premium sign construction using quality materials and expert craftsmanship.' },
                { number: '04', title: 'Installation', description: 'Professional installation with ongoing maintenance and support services.' },
              ].map((step) => (
                <div key={step.number} className="text-center group">
                  <div className="text-6xl md:text-7xl font-black text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">{step.number}</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
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
