import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';
import { deriveAdminToken } from '@/lib/admin-token';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-auth')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !token || token !== await deriveAdminToken(adminPassword)) {
    redirect('/admin/login');
  }

  return <AdminClient />;
}
