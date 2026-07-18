import Link from 'next/link';
import { Home, Briefcase } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-[7rem] md:text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600">
          404
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-lg text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-8 py-4 border border-red-500/40 text-red-200 font-semibold rounded-full hover:border-red-500 hover:bg-red-950/40 transition-all"
          >
            <Briefcase className="w-5 h-5" />
            View Our Work
          </Link>
        </div>
      </div>
    </main>
  );
}
