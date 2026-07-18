'use client';

import {
  Hero,
  ShatterText,
  LogoMarquee,
  MarketingCTA,
  FullscreenSlideshow
} from '@/components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Simple professional scroll reveal component
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  
  return (
    <motion.div ref={ref} style={{ opacity, y }} transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <Hero
        title={`Building Brands\nThat Stand Out`}
        description="We create powerful brand identities and construct premium signages that elevate your business presence."
      />

      <section className="relative py-[var(--space-5)] bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="phi-panel px-[var(--space-4)] py-[var(--space-3)] grid grid-cols-1 md:grid-cols-3 gap-[var(--space-3)]">
            {[
              { label: 'Brand Strategy', value: '01' },
              { label: 'Signage Craft', value: '02' },
              { label: 'Installation', value: '03' },
            ].map((item) => (
              <div key={item.value} className="flex items-center gap-4">
                <div className="text-red-200 font-display text-3xl">{item.value}</div>
                <div>
                  <div className="text-white font-semibold">{item.label}</div>
                  <div className="text-sm text-gray-400">Measured by precision</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <FadeInSection>
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-950 via-red-950 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-12">
            <div className="phi-panel px-[var(--space-4)] py-[var(--space-4)] grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-[var(--space-4)] items-center">
              <div>
                <h3 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] text-white mb-4">
                  Built to be seen. Engineered to endure.
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                  We combine precise fabrication, bold branding, and on-site execution to deliver signage
                  that performs in the real world.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Install Quality', value: 92 },
                  { label: 'Client Retention', value: 88 },
                  { label: 'On-Time Delivery', value: 94 },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          stroke="rgba(239,68,68,0.85)"
                          strokeWidth="10"
                          strokeDasharray={`${stat.value * 3.02} 999`}
                          strokeLinecap="round"
                          fill="none"
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-red-200">
                        {stat.value}%
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-400 uppercase tracking-[0.2em]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-12 text-center">
            <ShatterText className="font-display text-[clamp(2.3rem,4.2vw,4.4rem)] mb-3 bg-gradient-to-r from-red-400 via-red-300 to-red-200 text-transparent bg-clip-text">
              Work we&apos;re proud of
            </ShatterText>
            <p className="text-[clamp(0.98rem,1.4vw,1.2rem)] text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore our latest projects showcasing creativity and innovation
            </p>
          </div>

          <FullscreenSlideshow />
        </div>
      </section>
      </FadeInSection>

      {/* Client Logos */}
      <FadeInSection delay={0.15}>
        <LogoMarquee />
      </FadeInSection>


      {/* Marketing CTA */}
      <FadeInSection delay={0.25}>
        <MarketingCTA />
      </FadeInSection>
    </>
  );
}
