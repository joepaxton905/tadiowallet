'use client'

import { AdminProvider } from '@/lib/adminContext'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <AdminProvider>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedAdminRoute>
          <div className="min-h-screen bg-dark-950">
            <AdminSidebar />
            <main className="ml-64 min-h-screen">
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </ProtectedAdminRoute>
      )}
    </AdminProvider>
  )
}

