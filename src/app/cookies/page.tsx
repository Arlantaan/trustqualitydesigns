import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cookie Policy | Trust Quality Design',
  description: 'How Trust Quality Design uses cookies and similar technologies on our website.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Cookie Policy</h1>
      <section className="mb-8 text-lg leading-relaxed text-gray-800">
        <p className="mb-6">
          This Cookie Policy explains how Trust Quality Design uses cookies and similar
          technologies on our website. Cookies help us improve performance, understand
          usage, and provide a better experience.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website.
          They allow a site to remember your preferences and activity over time.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">2. How We Use Cookies</h2>
        <ul className="list-disc ml-8 mb-6">
          <li>To keep the site secure and operating properly.</li>
          <li>To understand which pages are most helpful.</li>
          <li>To improve performance and user experience.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">3. Managing Cookies</h2>
        <p>
          You can control or disable cookies through your browser settings. Note that
          some features of the site may not function properly without cookies.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">4. Learn More</h2>
        <p>
          You can review our broader data practices in the{" "}
          <Link href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">5. Contact</h2>
        <p>
          If you have questions about this Cookie Policy, email{" "}
          <a href="mailto:info@trustqualitydesign.com" className="text-blue-600 underline">
            info@trustqualitydesign.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
