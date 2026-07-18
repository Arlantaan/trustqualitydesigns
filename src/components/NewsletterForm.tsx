'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setMessage('You\'re subscribed! Check your inbox for a confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          placeholder="your@email.com"
          aria-label="Email address"
          className="flex-1 px-6 py-4 rounded-full bg-gray-900 text-red-100 placeholder-gray-500 border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-4 bg-white text-red-600 font-black rounded-full hover:scale-110 transition-all shadow-xl shadow-red-500/50 disabled:opacity-60 disabled:hover:scale-100 whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          role="status"
          className={`mt-4 text-base font-medium ${status === 'success' ? 'text-green-400' : 'text-red-300'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
