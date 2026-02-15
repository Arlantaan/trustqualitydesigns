'use client';

import { useEffect } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always add custom-cursor class - CSS media queries handle mobile hiding
    document.body.classList.add('custom-cursor');

    return () => {
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  return <>{children}</>;
}
