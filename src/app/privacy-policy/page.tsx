
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Privacy Policy | Trust Quality Design',
  description: 'How Trust Quality Design collects, uses, and safeguards your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto pt-24 pb-16 px-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white">Privacy Policy</h1>
      <section className="mb-8 text-lg leading-relaxed text-gray-300">
        <p className="mb-6">We value your privacy and are committed to protecting your personal information. This policy describes how we collect, use, and safeguard your data when you interact with our website and services.</p>
        <h2 className="text-2xl font-bold mt-10 mb-4">1. Data Collection</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc ml-8 mb-6">
          <li><strong>Personal Information:</strong> Name, email address, phone number, and other identifiers you provide when contacting us or using our services.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website, such as pages visited, time spent, and referring URLs.</li>
          <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze site usage.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-4">2. Use of Information</h2>
        <ul className="list-disc ml-8 mb-6">
          <li>To provide, operate, and maintain our website and services.</li>
          <li>To improve, personalize, and expand our offerings.</li>
          <li>To communicate with you, including responding to inquiries and sending updates.</li>
          <li>To analyze usage and trends to enhance user experience.</li>
          <li>To comply with legal obligations and protect our rights.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-4">3. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with trusted third parties who assist in operating our website, conducting business, or serving users, provided they agree to keep this information confidential. We may also disclose information if required by law or to protect our rights and safety.</p>
        <h2 className="text-2xl font-bold mt-10 mb-4">4. Data Security</h2>
        <p>We implement reasonable security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        <h2 className="text-2xl font-bold mt-10 mb-4">5. Your Rights</h2>
        <ul className="list-disc ml-8 mb-6">
          <li>Request access to or correction of your personal data.</li>
          <li>Request deletion of your data, subject to legal requirements.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Withdraw consent where processing is based on consent.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-4">6. Cookies</h2>
        <p>Cookies are small files stored on your device. You can control or disable cookies through your browser settings, but some features of our site may not function properly without them.</p>
        <h2 className="text-2xl font-bold mt-10 mb-4">7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        <h2 className="text-2xl font-bold mt-10 mb-4">8. Contact</h2>
        <p>If you have any questions or concerns about this Privacy Policy or your data, please contact us at <a href="mailto:info@trustqualitydesign.com" className="text-red-400 underline">info@trustqualitydesign.com</a>.</p>
      </section>
    </main>
  );
}
