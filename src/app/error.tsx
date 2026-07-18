'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600">
          Something went wrong
        </p>
        <p className="mt-6 text-lg text-gray-400">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 hover:scale-105 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 border border-red-500/40 text-red-200 font-semibold rounded-full hover:border-red-500 hover:bg-red-950/40 transition-all"
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
