import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { insertContact } from '@/lib/leads-db';
import { isRateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';

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

    // 1) Save the lead — THIS is what determines success. It's captured in the
    //    admin dashboard, so as long as it saves the visitor sees a success.
    const ipForDb = ip === 'unknown' ? undefined : ip;
    insertContact({ firstName, lastName, email, company, message, ip: ipForDb });

    // 2) Best-effort email notification — never allowed to fail the request.
    //    Fire and forget; if SMTP is down/misconfigured the lead is still saved.
    void sendNotification({ firstName, lastName, email, company, message });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Only reached if saving the lead itself failed.
    console.error('Contact API error (save failed):', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// Sends the notification email. All errors are swallowed and logged — the
// contact submission is already saved before this runs.
async function sendNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}) {
  try {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const mailFrom = process.env.MAIL_FROM || user;
    const mailTo = process.env.MAIL_TO || mailFrom;

    if (!host || !user || !pass || !mailFrom || !mailTo) return; // email not configured — skip silently

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');

    await transporter.sendMail({
      from: `"Trust Quality Design" <${mailFrom}>`,
      to: mailTo,
      replyTo: data.email,
      subject: `New Contact Message from ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${data.email}`,
        data.company ? `Company: ${data.company}` : '',
        '',
        data.message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2 style="margin: 0 0 12px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Contact notification email failed (lead was still saved):', err);
  }
}
