import { getSession } from '@/lib/session'
import AdminSidebar from './_components/AdminSidebar'
import { Suspense } from 'react'

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar userRole={session.role} userName={session.name} />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  )
}
