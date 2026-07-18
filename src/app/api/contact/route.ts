import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { insertContact } from '@/lib/leads-db';
import { isRateLimited } from '@/lib/rate-limit';

type ContactPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    // 5 submissions per IP per 15 minutes
    if (isRateLimited(`contact:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ContactPayload;
    const firstName = (body.firstName || '').trim();
    const lastName = (body.lastName || '').trim();
    const email = (body.email || '').trim();
    const company = (body.company || '').trim();
    const message = (body.message || '').trim();

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const mailFrom = process.env.MAIL_FROM || user;
    const mailTo = process.env.MAIL_TO || mailFrom;

    if (!host || !user || !pass || !mailFrom || !mailTo) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    // Persist lead to DB (non-blocking — never fail the request if DB errors)
    const ipForDb = ip === 'unknown' ? undefined : ip;
    try {
      insertContact({ firstName, lastName, email, company, message, ip: ipForDb });
    } catch (dbErr) {
      console.error('leads-db insertContact error:', dbErr);
    }

    await transporter.sendMail({
      from: `"Trust Quality Design" <${mailFrom}>`,
      to: mailTo,
      replyTo: email,
      subject: `New Contact Message from ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : '',
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2 style="margin: 0 0 12px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
