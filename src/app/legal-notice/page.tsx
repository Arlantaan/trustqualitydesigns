
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Legal Notice | Trust Quality Design',
  description: 'Legal notice and operator information for the Trust Quality Design website.',
  alternates: { canonical: '/legal-notice' },
};

export default function LegalNoticePage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-extrabold mb-8 mt-12 text-center text-gray-100">Legal Notice</h1>
      <section className="mb-8 text-lg leading-normal text-gray-100">
        <p className="mb-6">This website is operated by <strong>Trust Quality Design</strong>. We are committed to transparency and compliance with all applicable laws and regulations. Please read this legal notice carefully as it contains important information regarding your rights and obligations when using our website.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Contact Information</h2>
        <ul className="list-disc ml-8 mb-6">
          <li>Company: Trust Quality Design</li>
          <li>
            Address:{' '}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=C8X3%2B7JM%2C%20Serrekunda"
              className="underline text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              C8X3+7JM, Serrekunda
            </a>
          </li>
          <li>Email: <a href="mailto:info@trustqualitydesign.com" className="underline text-blue-300">info@trustqualitydesign.com</a></li>
          <li>Phone: <a href="tel:+2207516895" className="underline text-blue-300">+2207516895</a></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Represented By</h2>
        <p className="mb-6">Trust Quality Design Management</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Disclaimer</h2>
        <p className="mb-6">The information provided on this website is for general informational purposes only. While we strive for accuracy, we make no warranties regarding the completeness, reliability, or accuracy of this information. Any action you take upon the information on this website is strictly at your own risk. We are not liable for any losses or damages in connection with the use of our website.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">External Links</h2>
        <p className="mb-6">Our website may contain links to external websites. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or content. Visiting external links from our website is at your own risk.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Copyright & Intellectual Property</h2>
        <p className="mb-6">All content on this website, including text, images, graphics, and logos, is the property of [Your Company Name] unless otherwise stated. Unauthorized use, reproduction, or distribution is prohibited without written permission. You may not use any content from this site for commercial purposes without express written consent.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Dispute Resolution</h2>
        <p className="mb-6">We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board. However, we strive to resolve any issues amicably. Please contact us if you have concerns.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Jurisdiction</h2>
        <p className="mb-6">The laws of The Gambia apply. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Serrekunda, The Gambia.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Changes to This Legal Notice</h2>
        <p className="mb-6">We reserve the right to update this legal notice at any time. Changes will be posted on this page with an updated effective date. Please review this page regularly for updates.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Contact</h2>
        <p>If you have any questions regarding this legal notice, please contact us at <a href="mailto:info@trustqualitydesign.com" className="underline text-blue-300">info@trustqualitydesign.com</a>.</p>
      </section>
    </main>
  );
}
