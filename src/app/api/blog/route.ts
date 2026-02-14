import { NextRequest, NextResponse } from 'next/server';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
}

// Mock data - replace with database calls
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Design Systems',
    slug: 'the-future-of-design-systems',
    excerpt: 'Exploring emerging trends in design system architecture and implementation.',
    content: 'Full blog content here...',
    authorId: '1',
    publishedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    featured: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    // Get specific post by slug
    if (slug) {
      const post = mockBlogPosts.find((p) => p.slug === slug);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(post);
    }

    // Filter featured
    let filtered = mockBlogPosts;
    if (featured === 'true') {
      filtered = filtered.filter((p) => p.featured);
    }

    // Apply pagination
    const offsetNum = parseInt(offset);
    const limitNum = parseInt(limit);
    const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      offset: offsetNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Blog posts error:', error);
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
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // const post = await db.blogPost.create({
    //   data: {
    //     ...body,
    //     publishedAt: new Date(),
    //   },
    // });

    return NextResponse.json(
      { success: true, data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
