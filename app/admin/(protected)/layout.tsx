import { requireAdmin } from '@/lib/dal'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <AdminShell user={{ email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  )
}
