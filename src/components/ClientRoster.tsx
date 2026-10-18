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

// The Jawara International Conference Centre and the OIC Banjul Summit are
// deliberately NOT here: neither has a logo of its own — the summit work was a
// billboard built for the event. They remain in the work mosaic on the homepage
// and in caseStudies.ts, where the photograph is the credential.
const CLIENTS: Client[] = [
  { name: 'Ecobank', logo: '/images/logos/ecobank-the-pan-african-bank-loho-HD.png' },
  { name: 'GTBank', logo: '/images/logos/gtbank_logo.png' },
  { name: 'OctopusTech', logo: '/images/logos/octopus-tech-logo-rebranded-white.png' },
  { name: 'LinkUp Electronics', logo: '/images/logos/linkup-electronics.png' },
  { name: 'TAF Africa Global', logo: '/images/logos/taf-africa-global.png' },
  { name: 'GNPC', logo: '/images/logos/gnpc.png' },
  { name: 'Mirrored' },
  { name: 'Armanti Quality Food' },
  { name: 'Bloom Bank Africa' },
  { name: 'eZone Electronics' },
];

// Every logo sits directly on the black row — no white chips.
//
// Files are prepared before they land here, not patched with CSS. Two passes:
// an edge flood-fill clears the white card a logo was exported on without
// touching white used as a colour inside the mark, then dark NEUTRAL pixels are
// lifted towards white so a black wordmark reads on a dark row while saturated
// brand colour stays untouched. Ecobank and OctopusTech were already white
// artwork; GTBank is an orange tile that needed nothing; LinkUp needed its grey
// wordmark lifted. The script is scratchpad/darkify.py.
function Mark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <div className="relative shrink-0 h-12 w-32 opacity-80 hover:opacity-100 transition-opacity">
        <Image src={client.logo} alt={client.name} fill sizes="128px" className="object-contain" />
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
