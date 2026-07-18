import { NextRequest, NextResponse } from 'next/server';
import type { TeamMember } from '@/types';

// Mock data - replace with database calls
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Kumba Jallow',
    slug: 'kumba-jallow',
    position: 'Founder & CEO',
    bio: 'The driving force behind Trust Quality Design since 2012. Over a decade building The Gambia\'s most recognisable signs and brand identities.',
    avatar: '/images/websitepics/T_Q_D_10.jpg',
    specialties: ['Business Strategy', 'Client Relations', 'Brand Vision'],
    socialLinks: [],
  },
  {
    id: '2',
    name: 'Manjai',
    slug: 'manjai',
    position: 'Graphic Designer',
    bio: 'Creates logo concepts, brand identities, and artwork files ready for production across all print and signage formats.',
    avatar: '/images/websitepics/T_Q_D_11.jpg',
    specialties: ['Logo Design', 'Brand Identity', 'Print Production'],
    socialLinks: [],
  },
  {
    id: '3',
    name: 'Ebou Jobe',
    slug: 'ebou-jobe',
    position: 'Printing Department Manager',
    bio: 'Oversees all printing operations and production quality, ensuring every job meets TQD\'s standard of precision and durability.',
    avatar: '/images/websitepics/T_Q_D_12.jpg',
    specialties: ['Print Production', 'Quality Control', 'Operations'],
    socialLinks: [],
  },
  {
    id: '4',
    name: 'Fatou Jallow',
    slug: 'fatou-jallow',
    position: 'Marketing Manager',
    bio: 'Drives TQD\'s brand presence and client outreach, connecting businesses across The Gambia with the right signage and branding solutions.',
    avatar: '/images/websitepics/T_Q_D_13.jpg',
    specialties: ['Marketing Strategy', 'Client Outreach', 'Brand Promotion'],
    socialLinks: [],
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
