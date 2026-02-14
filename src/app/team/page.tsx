import { TeamGrid } from '@/components';
import type { Metadata } from 'next';
import type { TeamMember } from '@/types';

export const metadata: Metadata = {
  title: 'Team | Design Agency',
  description: 'Meet the talented designers, developers, and strategists behind our work.',
  openGraph: {
    title: 'Team | Design Agency',
    description: 'Meet the talented designers, developers, and strategists behind our work.',
    type: 'website',
    url: 'https://designagency.com/team',
  },
};

// Mock team members - replace with database calls
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    position: 'Creative Director',
    bio: 'Visionary designer with 12+ years leading transformative brand experiences.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    specialties: ['Brand Strategy', 'Art Direction', 'Visual Design'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahj' },
      { platform: 'twitter', url: 'https://twitter.com/sarahj' },
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    slug: 'michael-chen',
    position: 'Lead Developer',
    bio: 'Full-stack engineer passionate about scalable, secure web applications.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    specialties: ['Web Development', 'Backend Systems', 'DevOps'],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/mchen' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/mchen' },
    ],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    slug: 'emily-rodriguez',
    position: 'UX Researcher',
    bio: 'User-focused researcher uncovering insights that drive meaningful design decisions.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    specialties: ['User Research', 'Information Architecture', 'Usability Testing'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/erodriguez' },
      { platform: 'twitter', url: 'https://twitter.com/erodriguez' },
    ],
  },
  {
    id: '4',
    name: 'James Park',
    slug: 'james-park',
    position: 'Content Strategist',
    bio: 'Strategic communicator crafting compelling narratives across digital platforms.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    specialties: ['Content Strategy', 'Copywriting', 'SEO'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/jpark' },
      { platform: 'twitter', url: 'https://twitter.com/jpark' },
    ],
  },
  {
    id: '5',
    name: 'Lisa Wang',
    slug: 'lisa-wang',
    position: 'Product Manager',
    bio: 'Strategic product leader bridging business goals with user needs.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialties: ['Product Strategy', 'Project Management', 'Analytics'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/lwang' },
      { platform: 'twitter', url: 'https://twitter.com/lwang' },
    ],
  },
  {
    id: '6',
    name: 'David Martinez',
    slug: 'david-martinez',
    position: 'Design System Lead',
    bio: 'Design system architect creating scalable and consistent design solutions.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    specialties: ['Design Systems', 'Component Design', 'Documentation'],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/dmartinez' },
      { platform: 'dribbble', url: 'https://dribbble.com/dmartinez' },
    ],
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-950 via-red-950 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Team
            </h1>
            <p className="text-xl text-gray-300">
              Meet the talented designers, developers, and strategists behind our most successful projects.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamGrid members={mockTeamMembers} />
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Culture</h2>

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
            ].map((value) => (
              <div key={value.title} className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur rounded-lg p-8 border border-red-800/30">
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-lg text-red-100 mb-8">
            We're always looking for talented people who share our passion for great work.
          </p>
          <a
            href="/careers"
            className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </main>
  );
}
