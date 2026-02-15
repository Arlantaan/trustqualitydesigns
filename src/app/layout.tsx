import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header, Footer, ParticleNetwork, LiquidBackground, ShakeToClick, GyroscopeScroll } from '@/components';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Trust Quality | Branding & Signage Construction',
  description:
    'Premium branding services and custom signage construction. We create powerful brand identities and build high-quality signs that elevate your business presence.',
  keywords: ['branding company', 'signage construction', 'custom signs', 'brand identity', 'commercial signage', 'LED signs', 'monument signs', 'storefront signs'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-950 via-red-950 to-black text-white`}
      >
        <LiquidBackground />
        <ParticleNetwork />
        <ShakeToClick />
        <GyroscopeScroll />
        <Header />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
