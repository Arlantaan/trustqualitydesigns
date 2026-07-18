import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getContacts, getSubscribers, getStats } from '@/lib/leads-db';

export const runtime = 'nodejs';

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\n');
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format');
  const type   = url.searchParams.get('type') ?? 'contacts';

  if (format === 'csv') {
    const rows = type === 'subscribers'
      ? (getSubscribers() as unknown as Record<string, unknown>[])
      : (getContacts()    as unknown as Record<string, unknown>[]);
    const filename = type === 'subscribers' ? 'subscribers.csv' : 'contacts.csv';
    return new NextResponse(toCsv(rows), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({
    stats:       getStats(),
    contacts:    getContacts(),
    subscribers: getSubscribers(),
  });
}
