'use client';

import { 
  Hero, 
  CaseStudyGrid, 
  ShatterText,
  LogoMarquee,
  NewsUpdates,
  MarketingCTA
} from '@/components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Mock case studies - replace with API data
const mockCaseStudies = [
  {
    id: '1',
    title: 'Coco Ocean Resort & Spa',
    tagline: 'Luxury beachfront resort signage transformation',
    description: 'Premium signage system for iconic Gambian resort featuring illuminated entrance monument and comprehensive wayfinding.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Hospitality',
    challenge: 'Five-star resort needed elegant signage to match luxury positioning and guide international guests',
    solution: 'Custom LED entrance monument, poolside directionals, and multilingual wayfinding system',
    results: ['25+ custom signs installed', 'Enhanced guest satisfaction', '5-star TripAdvisor reviews'],
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'],
    slug: 'coco-ocean-signage',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Trust Bank Banjul Headquarters',
    tagline: 'Corporate banking brand presence',
    description: 'Monumental entrance signage and interior branding for Gambia\'s leading banking institution.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Financial Services',
    challenge: 'Headquarters needed prestigious signage reflecting trust and financial stability',
    solution: 'Illuminated monument sign, dimensional lobby letters, and branded wayfinding',
    results: ['Iconic landmark created', 'Enhanced corporate image', 'Improved customer confidence'],
    featuredImage: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=1200&q=80'],
    slug: 'trust-bank-headquarters',
    featured: false,
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Senegambia Strip Retail Complex',
    tagline: 'Tourist district commercial signage',
    description: 'Vibrant signage program for Gambia\'s premier shopping and entertainment district.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Retail & Entertainment',
    challenge: '20+ diverse businesses needed coordinated signage maintaining individual identity',
    solution: 'Channel letter storefronts, illuminated displays, and district wayfinding',
    results: ['20+ businesses branded', '45% increase in foot traffic', 'District landmark'],
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'],
    slug: 'senegambia-retail-complex',
    featured: false,
    publishedAt: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    title: 'Kanifing General Hospital',
    tagline: 'Healthcare facility wayfinding system',
    description: 'Life-saving wayfinding and departmental signage for major medical facility.',
    category: { id: '3', name: 'Wayfinding', slug: 'wayfinding' },
    industry: 'Healthcare',
    challenge: 'Complex hospital layout causing patient confusion and delayed emergency response',
    solution: 'Color-coded wayfinding, emergency department signs, multilingual systems',
    results: ['60+ directional signs', '30% faster patient navigation', 'Improved emergency response'],
    featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80'],
    slug: 'kanifing-hospital-wayfinding',
    featured: false,
    publishedAt: new Date('2023-12-28'),
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
  },
  {
    id: '5',
    title: 'Westfield Junction Commercial Hub',
    tagline: 'Mixed-use development branding',
    description: 'Complete signage package for new commercial and residential development in Serrekunda.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Real Estate',
    challenge: 'New development needed strong brand identity to attract tenants and customers',
    solution: 'Entrance monuments, building directories, tenant signage, and parking wayfinding',
    results: ['100% tenant occupancy', 'Premium rates achieved', 'Landmark status'],
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'],
    slug: 'westfield-junction-signage',
    featured: false,
    publishedAt: new Date('2023-12-20'),
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '6',
    title: 'Star Light Supermarket Chain',
    tagline: 'Retail brand identity modernization',
    description: 'Brand refresh and storefront signage upgrade for popular Gambian grocery chain.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Retail',
    challenge: 'Dated brand competing with new supermarkets, needed modern appeal',
    solution: 'New logo, illuminated channel letters, interior graphics, and outdoor pylon signs',
    results: ['8 locations updated', '32% sales growth', 'Market leader status'],
    featuredImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80'],
    slug: 'starlight-supermarket-rebrand',
    featured: false,
    publishedAt: new Date('2023-12-15'),
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
  },
  {
    id: '7',
    title: 'Atlantic Coast Medical Centre',
    tagline: 'Private healthcare facility branding',
    description: 'Complete signage and branding for modern medical clinic in Fajara.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Healthcare',
    challenge: 'New medical center needed professional signage to establish trust and visibility',
    solution: 'Illuminated entrance monument, ADA-compliant interior signs, and wayfinding system',
    results: ['35+ signs installed', 'Strong brand recognition', 'Increased patient confidence'],
    featuredImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80'],
    slug: 'atlantic-medical-centre',
    featured: false,
    publishedAt: new Date('2023-12-10'),
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2023-12-10'),
  },
];

// Mock news items
const mockNews = [
  {
    id: '1',
    title: 'Trust Quality Designs Wins Best Signage Company Award 2024',
    excerpt: 'Honored to receive the Gambian Business Excellence Award for outstanding contribution to signage and branding.',
    date: new Date('2024-02-01'),
    category: 'award' as const,
    image: 'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?w=800&q=80',
  },
  {
    id: '2',
    title: 'New Partnership with Leading Gambian Banks',
    excerpt: 'Proud to announce partnership with major financial institutions to redesign branch signage nationwide.',
    date: new Date('2024-01-28'),
    category: 'news' as const,
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80',
  },
  {
    id: '3',
    title: 'Completed: Senegambia Strip Retail Signage Project',
    excerpt: 'Successfully delivered comprehensive signage solutions for 15 retail outlets along the Senegambia Strip.',
    date: new Date('2024-01-20'),
    category: 'project' as const,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    id: '4',
    title: 'Expanded Workshop Capacity in Serrekunda',
    excerpt: 'New state-of-the-art fabrication facility doubles our production capacity to serve more businesses across The Gambia.',
    date: new Date('2024-01-15'),
    category: 'news' as const,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
  },
  {
    id: '5',
    title: 'Kololi Beach Resort Project Completed',
    excerpt: 'Delivered premium wayfinding and branding signage for major beachfront resort, enhancing guest experience.',
    date: new Date('2024-01-08'),
    category: 'project' as const,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  },
  {
    id: '6',
    title: 'New LED Technology Installation Training',
    excerpt: 'Team completed advanced training on latest LED signage systems, bringing cutting-edge technology to Gambian businesses.',
    date: new Date('2024-01-02'),
    category: 'event' as const,
    image: 'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=800&q=80',
  },
];

// Simple professional scroll reveal component
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

export default function Home() {
  const featuredStudy = mockCaseStudies.find((s) => s.featured);
  const otherStudies = mockCaseStudies.filter((s) => !s.featured);

  return (
    <>
      <Hero
        title="Building Brands That Stand Out"
        description="We create powerful brand identities and construct premium signages that elevate your business presence."
        cta={{ label: 'Explore Our Work', href: '/work' }}
      />

      {/* Work Section */}
      <FadeInSection>
        <section className="py-32 bg-gradient-to-b from-gray-950 via-red-950 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20 text-center">
            <ShatterText className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-red-400 via-red-300 to-red-200 text-transparent bg-clip-text">
              Work we&apos;re proud of
            </ShatterText>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore our latest projects showcasing creativity and innovation
            </p>
          </div>
          <CaseStudyGrid studies={otherStudies} featured={featuredStudy} />
        </div>
      </section>
      </FadeInSection>

      {/* Client Logos */}
      <FadeInSection delay={0.15}>
        <LogoMarquee />
      </FadeInSection>

      {/* News & Updates - Hidden until content is ready */}
      {/* 
      <FadeInSection delay={0.2}>
        <NewsUpdates 
          items={mockNews} 
          title="Latest News & Updates"
          subtitle="Stay informed about our recent projects and achievements"
        />
      </FadeInSection>
      */}

      {/* Marketing CTA */}
      <FadeInSection delay={0.2}>
        <MarketingCTA />
      </FadeInSection>
    </>
  );
}
