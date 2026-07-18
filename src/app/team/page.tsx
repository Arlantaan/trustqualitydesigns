import { TeamGrid } from '@/components';
import type { Metadata } from 'next';
import type { TeamMember } from '@/types';
import { PageHero, SectionReveal } from '@/components';

export const metadata: Metadata = {
  title: 'Our Team | Trust Quality Design',
  description: 'Meet the craftsmen, designers, and project managers behind The Gambia\'s leading signage and branding company.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Our Team | Trust Quality Design',
    description: 'Meet the craftsmen, designers, and project managers behind The Gambia\'s leading signage and branding company.',
    type: 'website',
    url: 'https://trustqualitydesign.com/team',
  },
};

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Kumba Jallow',
    slug: 'kumba-jallow',
    position: 'Founder & CEO',
    bio: 'The driving force behind Trust Quality Design since 2012. Over a decade building The Gambia\'s most recognisable signs and brand identities.',
    avatar: '',
    specialties: ['Business Strategy', 'Client Relations', 'Brand Vision'],
    socialLinks: [],
  },
  {
    id: '2',
    name: 'Manjai',
    slug: 'manjai',
    position: 'Graphic Designer',
    bio: 'Creates logo concepts, brand identities, and artwork files ready for production across all print and signage formats.',
    avatar: '',
    specialties: ['Logo Design', 'Brand Identity', 'Print Production'],
    socialLinks: [],
  },
  {
    id: '3',
    name: 'Ebou Jobe',
    slug: 'ebou-jobe',
    position: 'Printing Department Manager',
    bio: 'Oversees all printing operations and production quality, ensuring every job meets TQD\'s standard of precision and durability.',
    avatar: '',
    specialties: ['Print Production', 'Quality Control', 'Operations'],
    socialLinks: [],
  },
  {
    id: '4',
    name: 'Fatou Jallow',
    slug: 'fatou-jallow',
    position: 'Marketing Manager',
    bio: 'Drives TQD\'s brand presence and client outreach, connecting businesses across The Gambia with the right signage and branding solutions.',
    avatar: '',
    specialties: ['Marketing Strategy', 'Client Outreach', 'Brand Promotion'],
    socialLinks: [],
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-black">
      <PageHero
        title="Our Team"
        subtitle="Meet the talented designers, builders, and strategists behind our most successful projects."
        image="/images/websitepics/T_Q_D_18.jpg"
      />

      {/* Team Grid */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamGrid members={mockTeamMembers} />
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal variant="scale">
            <h2 className="text-5xl md:text-6xl font-black mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Our Culture</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Collaboration',
                description: 'We believe the best work happens when diverse perspectives come together.',
              },
              {
                title: 'Innovation',
                description: 'We stay ahead of trends and constantly push the boundaries of what\'s possible.',
              },
              {
                title: 'Excellence',
                description: 'We hold ourselves to the highest standards in everything we do.',
              },
            ].map((value, i) => (
              <SectionReveal key={value.title} variant="elevate" delay={i * 0.1}>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur rounded-3xl p-10 border border-red-900/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20 transition-all hover:scale-105">
                <h3 className="text-2xl font-bold mb-4 text-red-400">{value.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
              </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/websitepics/T_Q_D_21.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SectionReveal variant="scale">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">Join Our Team</h2>
            <p className="text-xl text-gray-300 mb-10">
              We're always looking for talented people who share our passion for great work.
            </p>
            <a
              href="/contact"
              className="inline-block px-12 py-6 bg-red-600 text-white font-black text-xl rounded-full hover:scale-110 transition-all shadow-2xl shadow-red-500/50 hover:shadow-red-500/70"
            >
              Get In Touch
            </a>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
