import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { pool } from '@/lib/db';

export const runtime = 'nodejs';

type SendPayload = {
  subject: string;
  html: string;
  text?: string;
  adminKey?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendPayload;
    const subject = (body.subject || '').trim();
    const html = (body.html || '').trim();
    const text = (body.text || '').trim();
    const adminKey = body.adminKey || request.headers.get('x-admin-key') || '';

    if (!subject || !html) {
      return NextResponse.json({ error: 'Subject and html are required.' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 500 });
    }

    if (!process.env.NEWSLETTER_ADMIN_KEY || adminKey !== process.env.NEWSLETTER_ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const mailFrom = process.env.MAIL_FROM || user;

    if (!host || !user || !pass || !mailFrom) {
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const result = await pool.query(
      `
      SELECT email, unsubscribe_token
      FROM newsletter_subscribers
      WHERE status = 'subscribed'
      ORDER BY created_at DESC
      `
    );

    let sent = 0;
    for (const row of result.rows) {
      const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${row.unsubscribe_token}`;
      const htmlWithUnsub = `${html}
        <div style="margin-top: 32px; font-size: 12px; color: #666;">
          <a href="${unsubscribeUrl}">Unsubscribe</a>
        </div>`;
      const textWithUnsub = text
        ? `${text}\n\nUnsubscribe: ${unsubscribeUrl}`
        : `Unsubscribe: ${unsubscribeUrl}`;

      await transporter.sendMail({
        from: `"Trust Quality Design" <${mailFrom}>`,
        to: row.email,
        subject,
        html: htmlWithUnsub,
        text: textWithUnsub,
      });
      sent += 1;
    }

    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: 'Failed to send newsletter.' }, { status: 500 });
  }
}
