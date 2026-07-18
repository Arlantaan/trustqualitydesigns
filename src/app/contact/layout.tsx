import type { Metadata } from 'next';

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'Contact | Trust Quality Design',
  description:
    'Get in touch with Trust Quality Design for signage construction, branding, vehicle wraps, and large-format print across The Gambia.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Trust Quality Design',
    description:
      'Get in touch with Trust Quality Design for signage construction, branding, vehicle wraps, and large-format print across The Gambia.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
