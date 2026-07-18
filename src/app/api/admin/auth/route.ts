import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deriveAdminToken } from '@/lib/admin-token';

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password?: string };
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured.' }, { status: 500 });
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = await deriveAdminToken(adminPassword);
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin-auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}
