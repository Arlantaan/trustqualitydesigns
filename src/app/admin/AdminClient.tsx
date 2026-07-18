'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  contactsTotal: number;
  contactsToday: number;
  contactsWeek: number;
  subsTotal: number;
  subsWeek: number;
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  company: string | null;
  message: string;
  ip: string | null;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  source: string | null;
  ip: string | null;
  created_at: string;
}

interface LeadsData {
  stats: Stats;
  contacts: Contact[];
  subscribers: Subscriber[];
}

export default function AdminClient() {
  const router = useRouter();
  const [data, setData]     = useState<LeadsData | null>(null);
  const [tab, setTab]       = useState<'contacts' | 'subscribers'>('contacts');

  useEffect(() => {
    fetch('/api/admin/leads')
      .then(r => r.json())
      .then((d: LeadsData) => setData(d))
      .catch(console.error);
  }, []);

  async function handleSignOut() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  function exportCsv(type: 'contacts' | 'subscribers') {
    window.location.href = `/api/admin/leads?format=csv&type=${type}`;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  const { stats, contacts, subscribers } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Leads Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Trust Quality Design</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Contacts Today', value: stats.contactsToday },
          { label: 'Contacts This Week', value: stats.contactsWeek },
          { label: 'Contacts Total', value: stats.contactsTotal },
          { label: 'Subscribers This Week', value: stats.subsWeek },
          { label: 'Subscribers Total', value: stats.subsTotal },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-red-400">{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['contacts', 'subscribers'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              tab === t
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {t === 'contacts' ? `Contacts (${contacts.length})` : `Subscribers (${subscribers.length})`}
          </button>
        ))}
        <button
          onClick={() => exportCsv(tab)}
          className="ml-auto px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'contacts' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Company</th>
                  <th className="text-left p-4">Message</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No contacts yet</td></tr>
                ) : (
                  contacts.map(c => (
                    <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                      <td className="p-4 font-medium">{[c.first_name, c.last_name].filter(Boolean).join(' ')}</td>
                      <td className="p-4 text-blue-400">{c.email}</td>
                      <td className="p-4 text-gray-400">{c.company ?? '—'}</td>
                      <td className="p-4 text-gray-300 max-w-xs truncate" title={c.message}>{c.message}</td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{c.created_at.slice(0, 16)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Source</th>
                  <th className="text-left p-4">IP</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">No subscribers yet</td></tr>
                ) : (
                  subscribers.map(s => (
                    <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                      <td className="p-4 text-blue-400 font-medium">{s.email}</td>
                      <td className="p-4 text-gray-400">{s.source ?? '—'}</td>
                      <td className="p-4 text-gray-500">{s.ip ?? '—'}</td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{s.created_at.slice(0, 16)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
