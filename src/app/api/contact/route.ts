import { NextRequest, NextResponse } from 'next/server';
import type { ContactFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validation
    if (!body.firstName || !body.lastName || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: Integrate with database
    // const contact = await db.contactForm.create({
    //   data: {
    //     firstName: body.firstName,
    //     lastName: body.lastName,
    //     email: body.email,
    //     company: body.company,
    //     projectType: body.projectType,
    //     message: body.message,
    //   },
    // });

    // TODO: Send notification email
    // await sendEmail({
    //   to: body.email,
    //   template: 'contact-confirmation',
    //   data: { firstName: body.firstName },
    // });

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
