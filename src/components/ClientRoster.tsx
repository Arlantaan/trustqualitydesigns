import Image from 'next/image';

// Client wall.
//
// Replaces a marquee that cycled the same three logo files three times, which
// read as "we have three clients". Every name below is a business whose work
// appears in this site's own case studies or project photography.
//
// Names are set as type rather than sourced logos on purpose: only three logo
// files exist in /public/images/logos, and a row mixing three real logos with
// ten wordmarks looks broken. Typeset consistently, the roster reads as a
// deliberate list -- and it stays honest, since nobody's trademark is being
// reproduced without permission.
//
// IMPORTANT: this list is the claim "these are our clients". Anything here that
// was not actually a TQD job must be removed.
const CLIENTS = [
  // Named explicitly in src/data/caseStudies.ts
  { name: 'Jawara International Conference Centre', work: 'Entrance signage' },
  { name: 'OIC Banjul Summit 2024', work: 'Hoardings & billboards' },
  { name: 'Mirrored', work: 'Retail & interior branding' },
  { name: 'LinkUp Electronics', work: 'Illuminated storefront' },
  { name: 'Armanti Quality Food', work: 'Vehicle wraps' },
  // Identified from project photography in /public/images/websitepics
  { name: 'Ecobank', work: 'Fascia & pylon signage' },
  { name: 'GTBank', work: 'Branch signage' },
  { name: 'GNPC', work: 'Pylon & 3D letters' },
  { name: 'Bloom Bank Africa', work: 'Reception signage' },
  { name: 'TAF Africa Global', work: 'Interior feature wall' },
  { name: 'Nescafé', work: 'Point-of-sale display' },
  { name: 'Zone Electronics', work: 'Building wrap' },
];

const LOGOS = [
  { src: '/images/logos/ecobank-the-pan-african-bank-loho-HD.png', alt: 'Ecobank' },
  { src: '/images/logos/gtbank_logo.png', alt: 'GTBank' },
  { src: '/images/logos/octopus-tech-logo-rebranded-white.png', alt: 'OctopusTech' },
];

export function ClientRoster() {
  return (
    <section className="py-[var(--space-5)] bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 mb-2">Clients</p>
            <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-white">
              Trusted by the names on the high street.
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Banks, government and retail — across The Gambia.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t border-white/10">
          {CLIENTS.map((c) => (
            <li
              key={c.name}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4 border-b border-white/10"
            >
              <span className="font-display text-lg sm:text-xl text-white leading-tight">{c.name}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">{c.work}</span>
            </li>
          ))}
        </ul>

        {/* The three brands we hold artwork for, shown as marks. */}
        <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6">
          {LOGOS.map((l) => (
            <div key={l.src} className="relative h-10 w-28 opacity-60 hover:opacity-100 transition-opacity">
              <Image src={l.src} alt={l.alt} fill sizes="112px" className="object-contain object-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
