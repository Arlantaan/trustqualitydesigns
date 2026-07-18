import type { Metadata } from 'next';
import { Bebas_Neue, Sora } from 'next/font/google';
import Script from 'next/script';
import { Header, Footer, MagneticCursor } from '@/components';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import './globals.css';

const displayFont = Bebas_Neue({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400'],
});

const bodyFont = Sora({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const siteTitle = 'Trust Quality Design | Branding & Signage Construction';
const siteDescription =
  'Premium branding services and custom signage construction. We create powerful brand identities and build high-quality signs that elevate your business presence.';
const socialImage = '/images/websitepics/T_Q_D_6.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  keywords: ['branding company', 'signage construction', 'custom signs', 'brand identity', 'commercial signage', 'LED signs', 'monument signs', 'storefront signs'],
  icons: {
    icon: '/t_q_d_LOGO.png',
    shortcut: '/t_q_d_LOGO.png',
    apple: '/t_q_d_LOGO.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: socialImage, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

// Structured data so search engines understand the business (local SEO / rich results).
const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  description: siteDescription,
  url: SITE_URL,
  logo: `${SITE_URL}/t_q_d_LOGO.png`,
  image: `${SITE_URL}${socialImage}`,
  telephone: '+2207516895',
  email: 'info@trustqualitydesign.com',
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C8X3+7JM',
    addressLocality: 'Serrekunda',
    addressCountry: 'GM',
  },
  areaServed: { '@type': 'Country', name: 'The Gambia' },
  sameAs: [
    'https://www.instagram.com/trust.quality.design72/',
    'https://www.facebook.com/trustqualitydesign',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} antialiased bg-gradient-to-b from-gray-950 via-red-950 to-black text-white custom-cursor`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <MagneticCursor />
        <Header />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
        {/* GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8X4RLLMHG1"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8X4RLLMHG1');`}
        </Script>
      </body>
    </html>
  );
}
