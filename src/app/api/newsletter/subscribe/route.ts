import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import { insertSubscriber } from '@/lib/leads-db';
import { isRateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type SubscribePayload = {
  email: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    // 3 attempts per IP per hour
    if (isRateLimited(`newsletter:${ip}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as SubscribePayload;
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    // 1) Save the subscriber — THIS is what determines success (visible in the
    //    admin dashboard). Email is a bonus, not a requirement.
    const ipForDb = ip === 'unknown' ? undefined : ip;
    const source = request.headers.get('referer') ?? undefined;
    insertSubscriber({ email, source, ip: ipForDb });

    // 2) Best-effort emails (admin alert + welcome) — never fail the request.
    void sendEmails(email, request.headers.get('referer') || 'unknown');

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Only reached if saving the subscriber itself failed.
    console.error('Newsletter subscribe error (save failed):', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// Sends the admin alert + subscriber welcome email. All errors swallowed —
// the subscriber is already saved before this runs.
async function sendEmails(email: string, referer: string) {
  try {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const mailFrom = process.env.MAIL_FROM || user;
    const mailTo = process.env.MAIL_TO || mailFrom;

    if (!host || !user || !pass || !mailFrom || !mailTo) return; // not configured — skip silently

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const submittedAt = new Date().toISOString();
    const newsletterImagePath = path.join(
      process.cwd(),
      'public',
      'images',
      'websitepics',
      '12276830_4530930.png'
    );

    await transporter.sendMail({
      from: `"Trust Quality Design" <${mailFrom}>`,
      to: mailTo,
      replyTo: email,
      subject: 'New Newsletter Signup',
      text: `Newsletter signup: ${email}\nSubmitted: ${submittedAt}\nPage: ${referer}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2 style="margin: 0 0 12px;">New Newsletter Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Submitted:</strong> ${submittedAt}</p>
          <p><strong>Page:</strong> ${referer}</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Trust Quality Design" <${mailFrom}>`,
      to: email,
      subject: 'Thanks for subscribing to Trust Quality Design',
      text: '',
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <div style="margin: 20px 0;">
            <img
              src="cid:tqd-newsletter"
              alt="Trust Quality Design Newsletter"
              style="width: 100%; max-width: 600px; height: auto; display: block; border: 0; margin: 0 auto;"
            />
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'Trust-Quality-Design-Newsletter.png',
          path: newsletterImagePath,
          cid: 'tqd-newsletter',
        },
      ],
    });
  } catch (err) {
    console.error('Newsletter email failed (subscriber was still saved):', err);
  }
}
