import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getContacts, getSubscribers, getStats } from '@/lib/leads-db';
import { deriveAdminToken } from '@/lib/admin-token';

export const runtime = 'nodejs';

// Defence in depth. Middleware already gates /api/admin/*, but this route
// serves every contact, email and IP we hold, so it must not be one config
// mistake away from public. It was exactly that when middleware.ts sat at the
// repo root, where Next silently ignores it in a src/ project.
async function isAuthed(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookie = request.cookies.get('admin-auth')?.value;
  if (!cookie) return false;
  return cookie === (await deriveAdminToken(adminPassword));
}

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
  if (!(await isAuthed(request))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

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
