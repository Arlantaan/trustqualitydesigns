import { NextRequest, NextResponse } from 'next/server';
import type { ServiceOffering } from '@/types';

// Mock data - replace with database calls
const mockServices: ServiceOffering[] = [
  {
    id: '1',
    name: 'Brand Strategy',
    slug: 'brand-strategy',
    description: 'Comprehensive brand development and positioning.',
    icon: 'Target',
    features: ['Brand audit', 'Positioning strategy', 'Brand guidelines'],
  },
  {
    id: '2',
    name: 'Product Design',
    slug: 'product-design',
    description: 'User-centered product and interface design.',
    icon: 'Palette',
    features: ['UX research', 'Wireframing', 'Visual design', 'Prototyping'],
  },
  {
    id: '3',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Strategic digital marketing and growth tactics.',
    icon: 'Trending Up',
    features: ['Strategy development', 'Campaign execution', 'Analytics'],
  },
  {
    id: '4',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern, scalable web applications and websites.',
    icon: 'Code',
    features: ['Frontend development', 'Backend systems', 'Deployment'],
  },
  {
    id: '5',
    name: 'Content Strategy',
    slug: 'content-strategy',
    description: 'Strategic content creation and management.',
    icon: 'FileText',
    features: ['Content planning', 'Copywriting', 'Content management'],
  },
  {
    id: '6',
    name: 'Analytics & Analytics',
    slug: 'analytics',
    description: 'Data-driven insights and measurement.',
    icon: 'BarChart3',
    features: ['Analytics setup', 'Reporting', 'Optimization'],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    // Get specific service by ID
    if (id) {
      const service = mockServices.find((s) => s.id === id);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(service);
    }

    // Get specific service by slug
    if (slug) {
      const service = mockServices.find((s) => s.slug === slug);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(service);
    }

    // Return all services
    return NextResponse.json(mockServices);
  } catch (error) {
    console.error('Services error:', error);
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
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // const service = await db.service.create({ data: body });

    return NextResponse.json(
      { success: true, data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
