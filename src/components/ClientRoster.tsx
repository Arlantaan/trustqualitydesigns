'use client';

import Image from 'next/image';

// Flowing client marquee.
//
// Twelve real clients rather than three logo files cycled three times. Only
// Ecobank, GTBank and OctopusTech exist as artwork in /public/images/logos, so
// the remaining nine ride as typeset wordmarks — set at the same height and
// opacity as the marks so the row reads as one continuous band.
//
// Drop a PNG into /public/images/logos and add `logo:` to an entry below to
// promote a wordmark to a real mark. No other change needed.
//
// IMPORTANT: this row is the claim "these are our clients". Anything here that
// was not actually a TQD job must be removed.
type Client = { name: string; logo?: string };

const CLIENTS: Client[] = [
  // Named in src/data/caseStudies.ts
  { name: 'Jawara International Conference Centre' },
  { name: 'OIC Banjul Summit 2024' },
  { name: 'Mirrored' },
  { name: 'LinkUp Electronics' },
  { name: 'Armanti Quality Food' },
  // Identified from project photography in /public/images/websitepics
  { name: 'Ecobank', logo: '/images/logos/ecobank-the-pan-african-bank-loho-HD.png' },
  { name: 'GTBank', logo: '/images/logos/gtbank_logo.png' },
  { name: 'OctopusTech', logo: '/images/logos/octopus-tech-logo-rebranded-white.png' },
  { name: 'GNPC' },
  { name: 'Bloom Bank Africa' },
  { name: 'TAF Africa Global' },
  { name: 'Zone Electronics' },
];

function Mark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <div className="relative h-10 w-28 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <Image src={client.logo} alt={client.name} fill sizes="112px" className="object-contain" />
      </div>
    );
  }
  return (
    <span className="shrink-0 font-display text-xl text-white/70 hover:text-white whitespace-nowrap transition-colors">
      {client.name}
    </span>
  );
}

export function ClientRoster() {
  // The list is rendered twice back-to-back; the track translates by exactly
  // -50%, so the second copy lands where the first began and the loop is
  // seamless. CSS animation rather than requestAnimationFrame — it runs on the
  // compositor, survives background tabs, and stops for reduced-motion users.
  const track = [...CLIENTS, ...CLIENTS];

  return (
    <section className="py-[var(--space-5)] bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-2">Clients</p>
        <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white">
          Trusted by the names on the high street.
        </h2>
      </div>

      <div className="relative marquee-mask">
        <div className="marquee-track flex items-center gap-14">
          {track.map((c, i) => (
            <Mark key={`${c.name}-${i}`} client={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
