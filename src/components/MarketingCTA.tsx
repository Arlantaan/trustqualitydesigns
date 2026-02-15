'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function MarketingCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter signup logic here
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-[0.3em]">
                Stay Connected
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
              Get Exclusive{' '}
              <span className="text-white">
                Updates
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Subscribe to receive the latest projects, design trends, and special offers delivered to your inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-8 py-4 bg-white text-black font-bold rounded-lg hover:shadow-2xl transition-all duration-300"
              >
                {isSubmitted ? '✓ Subscribed!' : 'Subscribe Now'}
              </motion.button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.div>

          {/* Right Side - Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Quick Contact Cards */}
            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl border-2 border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    Call Us Now
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Speak directly with our team
                  </p>
                  <a href="tel:+2203456789" className="text-gray-400 font-semibold text-lg">
                    +220 345 6789
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl border-2 border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    Start a Project
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Get a free consultation today
                  </p>
                  <a href="/contact" className="text-gray-400 font-semibold text-lg">
                    Contact Us →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
