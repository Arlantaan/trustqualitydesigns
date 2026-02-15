'use client';

import { 
  Hero, 
  CaseStudyGrid, 
  ShatterText, 
  LogoMarquee, 
  ServiceCard,
  NewsUpdates, 
  MarketingCTA,
  ScrollProgress,
  SectionReveal,
  ScrollTransition
} from '@/components';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Award, Users, Zap } from 'lucide-react';

// Mock case studies - replace with API data
const mockCaseStudies = [
  {
    id: '1',
    title: 'Corporate Campus Signage',
    tagline: 'Premium architectural signage system',
    description: 'Complete wayfinding and branding installation for Fortune 500 headquarters.',
    category: { id: '1', name: 'Signage Construction', slug: 'signage-construction' },
    industry: 'Corporate',
    challenge: 'Large campus needed cohesive wayfinding and brand presence',
    solution: 'Custom LED signage, directional systems, and monument signs',
    results: ['50+ custom signs installed', 'Enhanced brand visibility', 'Improved visitor navigation'],
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'],
    slug: 'corporate-campus-signage',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Retail Brand Identity',
    tagline: 'Complete brand transformation with storefront signage',
    description: 'Brand redesign and premium signage for boutique retail chain.',
    category: { id: '2', name: 'Branding', slug: 'branding' },
    industry: 'Retail',
    challenge: 'Outdated brand identity and inconsistent signage across locations',
    solution: 'New brand guidelines with custom illuminated channel letters and window graphics',
    results: ['35% increase in foot traffic', 'Unified brand presence across 12 locations'],
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'],
    slug: 'retail-brand-identity',
    featured: false,
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

// Mock news items
const mockNews = [
  {
    id: '1',
    title: 'Trust Quality Designs Wins Best Signage Company Award 2024',
    excerpt: 'We are honored to receive the prestigious Gambian Business Excellence Award for our outstanding contribution to the signage and branding industry.',
    date: new Date('2024-02-01'),
    category: 'award' as const,
    image: 'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'New Partnership with Leading Gambian Banks',
    excerpt: 'Proud to announce our partnership with major financial institutions to redesign branch signage nationwide.',
    date: new Date('2024-01-28'),
    category: 'news' as const,
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80',
  },
  {
    id: '3',
    title: 'Completed: Senegambia Strip Retail Signage Project',
    excerpt: 'Successfully delivered comprehensive signage solutions for 15 retail outlets along the iconic Senegambia Strip.',
    date: new Date('2024-01-20'),
    category: 'project' as const,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
];

// Services
const services = [
  {
    id: '1',
    title: 'Brand Identity Design',
    description: 'Complete brand development from concept to implementation, including logo design, color schemes, and brand guidelines.',
    icon: '🎨',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Marketing Collateral'],
    slug: 'brand-identity',
  },
  {
    id: '2',
    title: 'Custom Signage Construction',
    description: 'Premium quality signage manufacturing including LED signs, channel letters, monument signs, and architectural signage.',
    icon: '🏢',
    features: ['LED Signage', 'Channel Letters', 'Monument Signs', 'Wayfinding Systems'],
    slug: 'signage-construction',
  },
  {
    id: '3',
    title: 'Digital Marketing Solutions',
    description: 'Comprehensive digital presence development including website design, social media management, and online branding.',
    icon: '💻',
    features: ['Website Design', 'Social Media', 'SEO Services', 'Content Marketing'],
    slug: 'digital-marketing',
  },
];

export default function Home() {
  const featuredStudy = mockCaseStudies.find((s) => s.featured);
  const otherStudies = mockCaseStudies.filter((s) => !s.featured);

  return (
    <div>
      <ScrollProgress />
      
      <Hero
        title="Building Brands That Stand Out"
        description="We create powerful brand identities and construct premium signages that elevate your business presence in The Gambia."
        cta={{ label: 'Explore our Work', href: '/work' }}
      />

      {/* Why Choose Us Section */}
      <ScrollTransition variant="wipe" intensity="dramatic">
        <section className="py-32 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionReveal variant="elevate" className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                Why Gambian Businesses Trust Us
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Over a decade of experience serving The Gambia's leading brands with excellence and innovation
              </p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="w-12 h-12" />,
                  title: 'Award-Winning Excellence',
                  description: 'Recognized as Gambia's premier branding and signage company with multiple industry awards.',
                },
                {
                  icon: <Users className="w-12 h-12" />,
                  title: 'Local Expertise',
                  description: 'Deep understanding of Gambian market dynamics and cultural nuances for effective branding.',
                },
                {
                  icon: <Zap className="w-12 h-12" />,
                  title: 'Fast Turnaround',
                  description: 'Efficient project delivery without compromising on quality, keeping your business moving.',
                },
              ].map((item, i) => (
                <SectionReveal key={i} variant="scale" delay={i * 0.2}>
                  <div className="group p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-red-500 transition-all duration-500 hover:transform hover:scale-105">
                    <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollTransition>

      {/* Services Overview */}
      <ScrollTransition variant="curtain" intensity="dramatic">
        <section className="py-32 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionReveal variant="elevate" className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                Our Services
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive branding and signage solutions tailored for Gambian businesses
              </p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {services.map((service, i) => (
                <SectionReveal key={service.id} variant="slideLeft" delay={i * 0.15}>
                  <ServiceCard service={service} />
                </SectionReveal>
              ))}
            </div>

            <SectionReveal variant=" fade" delay={0.5} className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 group"
              >
                <span>View All Services</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>
          </div>
        </section>
      </ScrollTransition>

      {/* Featured Work Section */}
      <ScrollTransition variant="wipe" intensity="dramatic">
        <section className="py-32 bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionReveal variant="elevate" className="mb-20 text-center">
              <ShatterText className="text-5xl md:text-7xl font-black mb-8 text-white">
                Featured Projects
              </ShatterText>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Showcasing transformative branding and signage projects across The Gambia
              </p>
            </SectionReveal>
            
            <SectionReveal variant="scale" delay={0.3}>
              <CaseStudyGrid studies={otherStudies} featured={featuredStudy} />
            </SectionReveal>

            <SectionReveal variant="fade" delay={0.6} className="text-center mt-16">
              <Link
                href="/work"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-red-600 text-white font-bold rounded-full hover:bg-red-600 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 group"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>
          </div>
        </section>
      </ScrollTransition>

      {/* Stats Section */}
      <ScrollTransition variant="curtain" intensity="dramatic">
        <section className="py-32 bg-gradient-to-br from-gray-950 via-red-950 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djhhNCA0IDAgMCAxLTQgNEgyMGE0IDQgMCAwIDEtNC00di04YTQgNCAwIDAgMSA0LTRoMTJhNCA0IDAgMCAxIDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionReveal variant="elevate" className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                Trusted By Gambia's Best
              </h2>
              <p className="text-xl text-gray-400">
                Numbers that speak for our commitment to excellence
              </p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { number: '200+', label: 'Projects Delivered', icon: '🚀' },
                { number: '95%', label: 'Client Satisfaction', icon: '💼' },
                { number: '50+', label: 'Business Partners', icon: '🤝' },
                { number: '10+', label: 'Years in Business', icon: '⭐' },
              ].map((stat, i) => (
                <SectionReveal key={i} variant="scale" delay={i * 0.1}>
                  <div className="text-center group hover:transform hover:scale-110 transition-all duration-300">
                    <div className="text-6xl mb-4">{stat.icon}</div>
                    <div className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                      {stat.number}
                    </div>
                    <p className="text-gray-300 text-lg font-medium">{stat.label}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollTransition>

      {/* Client Logos */}
      <LogoMarquee />

      {/* Testimonials Section */}
      <ScrollTransition variant="wipe" intensity="dramatic">
        <section className="py-32 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionReveal variant="elevate" className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-400">
                Hear from Gambian businesses we've helped transform
              </p>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Trust Quality Designs transformed our brand identity completely. Their understanding of the Gambian market is unmatched.",
                  author: "Fatou Jallow",
                  company: "Senegambia Beach Hotel",
                  role: "Marketing Director",
                },
                {
                  quote: "The signage they created for our bank branches exceeded all expectations. Professional, timely, and high quality.",
                  author: "Ebrima Ceesay",
                  company: "Trust Bank Gambia",
                  role: "Head of Operations",
                },
                {
                  quote: "From concept to installation, the team was exceptional. Our new storefront signage has increased foot traffic significantly.",
                  author: "Mariama Bah",
                  company: "Kairaba Shopping Center",
                  role: "Property Manager",
                },
              ].map((testimonial, i) => (
                <SectionReveal key={i} variant="slideLeft" delay={i * 0.15}>
                  <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-red-500 transition-all duration-500">
                    <div className="text-red-500 text-5xl mb-4">"</div>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{testimonial.author}</div>
                        <div className="text-gray-500 text-sm">{testimonial.role}</div>
                        <div className="text-gray-600 text-sm">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollTransition>

      {/* News & Updates */}
      <NewsUpdates 
        items={mockNews} 
        title="Latest News & Updates"
        subtitle="Stay informed about our recent projects, achievements, and company milestones"
      />

      {/* Marketing CTA */}
      <MarketingCTA />

      {/* Final CTA Section */}
      <ScrollTransition variant="curtain" intensity="dramatic">
        <section className="py-32 bg-gradient-to-br from-red-950 via-gray-950 to-black relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <SectionReveal variant="scale">
              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
                Let's create something extraordinary for your business in The Gambia
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 group"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/work"
                  className="inline-flex items-center gap-3 px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                  <span>View Portfolio</span>
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-gray-800">
                {[
                  { icon: <CheckCircle className="w-8 h-8" />, text: 'Free Consultation' },
                  { icon: <CheckCircle className="w-8 h-8" />, text: 'Fast Turnaround' },
                  { icon: <CheckCircle className="w-8 h-8" />, text: 'Quality Guarantee' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="text-green-500">{item.icon}</div>
                    <p className="text-gray-300 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>
      </ScrollTransition>
    </div>
  );
}
