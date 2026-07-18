import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = (searchParams.get('token') || '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 500 });
    }

    const result = await pool.query(
      `
      UPDATE newsletter_subscribers
      SET status = 'unsubscribed', unsubscribed_at = NOW()
      WHERE unsubscribe_token = $1
      RETURNING email
      `,
      [token]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 404 });
    }

    return new NextResponse(
      `
      <html>
        <head><title>Unsubscribed</title></head>
        <body style="font-family: Arial, sans-serif; padding: 32px; background:#0b0b0b; color:#fff;">
          <h1>You’re unsubscribed</h1>
          <p>${result.rows[0].email} has been removed from the newsletter list.</p>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe.' }, { status: 500 });
  }
}
