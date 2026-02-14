import { NextRequest, NextResponse } from 'next/server';
import type { CaseStudy } from '@/types';

// Mock data - replace with database calls
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'SaaS Platform Redesign',
    tagline: 'Transforming complexity into simplicity',
    description: 'Complete redesign of a B2B SaaS platform.'  ,
    category: { id: '1', name: 'Product Design', slug: 'product-design' },
    industry: 'Software',
    challenge: 'Complex navigation led to poor adoption',
    solution: 'User-centered redesign with new information architecture',
    results: ['45% increase in adoption', '3.2x faster task completion'],
    featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'],
    slug: 'saas-platform-redesign',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const id = searchParams.get('id');

    // Get specific case study by ID
    if (id) {
      const caseStudy = mockCaseStudies.find((cs) => cs.id === id);
      if (!caseStudy) {
        return NextResponse.json(
          { error: 'Case study not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(caseStudy);
    }

    // Filter featured
    if (featured === 'true') {
      const featuredStudies = mockCaseStudies.filter((cs) => cs.featured);
      return NextResponse.json(featuredStudies);
    }

    // Return all case studies
    return NextResponse.json(mockCaseStudies);
  } catch (error) {
    console.error('Case studies error:', error);
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
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // const caseStudy = await db.caseStudy.create({ data: body });

    return NextResponse.json(
      { success: true, data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create case study error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
