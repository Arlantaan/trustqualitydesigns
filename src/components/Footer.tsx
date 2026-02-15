'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'Careers', href: '/careers' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/work' },
    { label: 'Resources', href: '/resources' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
};

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'in' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'tw' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'ig' },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: 'db' },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* CTA Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Let's build your brand together</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Ready to elevate your brand with premium signage and impactful branding? Let's discuss your project.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:shadow-xl transition-shadow"
          >
            Start Your Project
          </Link>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg" />
              <span className="font-bold text-white">TQD</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting digital experiences through thoughtful design and strategic thinking.
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
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500">&copy; {currentYear} Trust Quality Designs. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
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
