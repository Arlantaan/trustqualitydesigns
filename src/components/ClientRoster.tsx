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
// `light` means the artwork is already white/pale — it was drawn for dark
// backgrounds and sits straight on the black row. Everything else is colour or
// dark type and gets a white chip, because keying white out of a logo destroys
// marks that use white as an actual colour (LinkUp's L sits in a white square;
// its E is white bars). Measure before setting this: Ecobank and OctopusTech
// average 255 and 225 luminance, GTBank and LinkUp 121 and 117.
type Client = { name: string; logo?: string; light?: boolean };

const CLIENTS: Client[] = [
  // Named in src/data/caseStudies.ts
  { name: 'Jawara International Conference Centre' },
  { name: 'OIC Banjul Summit 2024' },
  { name: 'Mirrored' },
  { name: 'LinkUp Electronics', logo: '/images/logos/linkup-electronics.png' },
  { name: 'Armanti Quality Food' },
  // Identified from project photography in /public/images/websitepics
  { name: 'Ecobank', logo: '/images/logos/ecobank-the-pan-african-bank-loho-HD.png', light: true },
  { name: 'GTBank', logo: '/images/logos/gtbank_logo.png' },
  { name: 'OctopusTech', logo: '/images/logos/octopus-tech-logo-rebranded-white.png', light: true },
  { name: 'GNPC' },
  { name: 'Bloom Bank Africa' },
  { name: 'TAF Africa Global' },
  { name: 'Zone Electronics' },
];

// Logos sit on a light chip rather than straight on the black row.
//
// Client logos arrive in whatever form the client supplied: some transparent,
// most exported on a white card, several using white as an active colour inside
// the mark (LinkUp's L sits in a white square; the E is white bars). Keying out
// white to fake transparency destroys those marks. A chip renders every logo
// faithfully, on the white they were designed against, and means any new file
// dropped into /public/images/logos works without processing.
function Mark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <div
        className={`shrink-0 flex h-14 w-36 items-center justify-center opacity-85 hover:opacity-100 transition-opacity ${
          client.light ? '' : 'rounded-md bg-white px-4 py-2.5'
        }`}
      >
        <div className="relative h-full w-full">
          <Image src={client.logo} alt={client.name} fill sizes="144px" className="object-contain" />
        </div>
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
