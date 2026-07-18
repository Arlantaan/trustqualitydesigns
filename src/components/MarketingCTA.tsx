'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function MarketingCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="relative phi-pad-y bg-black overflow-hidden">
      <div className="absolute inset-0 phi-grid-bg opacity-20" />
      <div className="absolute inset-0 pyth-grid opacity-25" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.618fr_0.382fr] phi-gap-lg items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-[clamp(2.6rem,4vw,4rem)] mb-[var(--space-3)] text-white leading-tight">
              Insightful Builds, Delivered.
            </h2>

            <p className="text-[clamp(1rem,1.6vw,1.3rem)] text-gray-300 mb-[var(--space-4)] leading-relaxed">
              Subscribe for project highlights, design strategy, and red-hot launches.
            </p>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-[18px] bg-gray-900 border border-red-800/40 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-400/70 transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-8 py-[18px] bg-red-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300"
              >
                {isSubmitted ? 'Subscribed!' : 'Subscribe Now'}
              </motion.button>
            </form>

            <div className="phi-divider mt-[var(--space-3)]" />
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative overflow-hidden phi-card bg-gradient-to-br from-gray-950 via-black to-red-950/30 border border-red-800/40 hover:border-red-500/50 p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl border-2 border-red-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-7 h-7 text-red-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-red-200 transition-colors">
                    Call Us Now
                  </h3>
                  <p className="text-gray-400 mb-3">Speak directly with our team</p>
                  <a href="tel:+2203456789" className="text-red-200 font-semibold text-lg">
                    +220 345 6789
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative overflow-hidden phi-card bg-gradient-to-br from-gray-950 via-black to-red-950/30 border border-red-800/40 hover:border-red-500/50 p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl border-2 border-red-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-7 h-7 text-red-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-red-200 transition-colors">
                    Plan a Consult
                  </h3>
                  <p className="text-gray-400 mb-3">Get a free consultation today</p>
                  <a href="/contact" className="text-red-200 font-semibold text-lg">
                    Contact Us {'->'}
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
