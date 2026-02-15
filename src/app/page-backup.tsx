'use client';

import { Hero } from '@/components';

export default function Home() {
  return (
    <div>
      <Hero
        title="Building Brands That Stand Out"
        description="We create powerful brand identities and construct premium signages that elevate your business presence in The Gambia."
        cta={{ label: 'Explore Our Work', href: '/work' }}
      />
    </div>
  );
}
