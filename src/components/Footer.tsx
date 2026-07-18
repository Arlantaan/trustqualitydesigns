'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'Team', href: '/team' },
  ],
  resources: [
    { label: 'Case Studies', href: '/work' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Legal Notice', href: '/legal-notice' },
    { label: 'Cookie Policy', href: '/privacy-policy#cookies' },
  ],
};

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/trust.quality.design72/', icon: 'ig' },
  { label: 'Facebook', href: 'https://www.facebook.com/trustqualitydesign', icon: 'fb' },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to subscribe.');
      }

      setNewsletterStatus('success');
      setNewsletterMessage('Thanks for subscribing!');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Failed to subscribe.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/images/websitepics/Favicontqd.png"
                alt="Trust Quality Design logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain brightness-110 contrast-110"
              />
              <span className="font-bold text-white">Trust Quality Design</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Building brands and constructing quality signage across The Gambia since 2012.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get project highlights and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors disabled:opacity-60"
              >
                {newsletterStatus === 'loading' ? 'Joining...' : 'Join Newsletter'}
              </button>
              {newsletterMessage && (
                <p className={`text-xs ${newsletterStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500">&copy; {currentYear} Trust Quality Design. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal-notice" className="text-gray-400 hover:text-white transition-colors">
                Legal Notice
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

