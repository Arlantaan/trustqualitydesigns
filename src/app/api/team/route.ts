import { NextRequest, NextResponse } from 'next/server';
import type { TeamMember } from '@/types';

// Mock data - replace with database calls
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    position: 'Creative Director',
    bio: 'Visionary designer with 12+ years of experience in brand strategy.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    specialties: ['Brand Strategy', 'Art Direction'],
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
    specialties: ['Web Development', 'Backend Systems'],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/mchen' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/mchen' },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    // Get specific team member by ID
    if (id) {
      const member = mockTeamMembers.find((m) => m.id === id);
      if (!member) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(member);
    }

    // Get specific team member by slug
    if (slug) {
      const member = mockTeamMembers.find((m) => m.slug === slug);
      if (!member) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(member);
    }

    // Return all team members
    return NextResponse.json(mockTeamMembers);
  } catch (error) {
    console.error('Team members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization (implement proper auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // const member = await db.teamMember.create({ data: body });

    return NextResponse.json(
      { success: true, data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
