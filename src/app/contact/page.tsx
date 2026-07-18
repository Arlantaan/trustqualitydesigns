'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

// Metadata for this route lives in ./layout.tsx (this is a client component).

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Split name into firstName and lastName for backend compatibility
    const [firstName, ...rest] = formData.name.trim().split(' ');
    const lastName = rest.join(' ') || '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative overflow-hidden min-h-[38vh]">
        <img src="/images/websitepics/T_Q_D_8.jpg" alt="" className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div className="relative z-10 flex items-center justify-center h-full py-32 text-center">
          <div>
            <div className="h-1 w-16 bg-red-500 mx-auto mb-6 rounded-full" />
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4">Contact</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Let's discuss your branding or signage project and how we can help elevate your business presence.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300">
                  Thank you! We've received your message and will be in touch soon.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-red-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-red-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your email"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-red-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-red-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">Contact Details</h2>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">Email</h3>
                    <a href="mailto:info@trustqualitydesign.com" className="text-gray-300 hover:text-red-400">
                      info@trustqualitydesign.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      <Phone className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">Phone</h3>
                    <a href="tel:+2207516895" className="text-gray-300 hover:text-red-400">
                      +2207516895
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">Address</h3>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=C8X3%2B7JM%2C%20Serrekunda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-red-400 underline"
                    >
                      C8X3+7JM, Serrekunda
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-12 p-6 bg-red-900/30 rounded-lg border border-red-700/50">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-red-400">Response Time:</span> We typically respond to inquiries within 24 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">FAQ</h2>

          <div className="space-y-6">
            {[
              {
                question: 'What is your typical project timeline?',
                answer: 'Project timelines vary based on scope and complexity. Most projects range from 4-12 weeks. We provide detailed timelines during the discovery phase.',
              },
              {
                question: 'What is your pricing structure?',
                answer: 'We offer flexible engagement models including fixed-price projects, time-and-materials, and retainer relationships. We provide custom quotes after understanding your needs.',
              },
              {
                question: 'Do you work with startups?',
                answer: 'Absolutely! We work with businesses of all sizes, from early-stage startups to established enterprises. We offer flexible options to work within different budgets.',
              },
              {
                question: 'Can you help with ongoing support and maintenance?',
                answer: 'Yes! We offer retainer packages for ongoing support, updates, and optimization. Many clients work with us long-term as their design and development partner.',
              },
            ].map((faq, index) => (
              <details key={index} className="group border border-red-800/30 rounded-lg p-6 cursor-pointer bg-gradient-to-br from-red-900/30 to-red-950/30 backdrop-blur">
                <summary className="flex items-center justify-between font-semibold text-white hover:text-red-400">
                  {faq.question}
                  <span className="ml-2 group-open:rotate-180 transition-transform">v</span>
                </summary>
                <p className="mt-4 text-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
