'use client'

import { useState } from 'react'
import { AdminProvider } from '@/lib/adminContext'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminProvider>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedAdminRoute>
          <div className="min-h-screen bg-dark-950">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <main className="md:ml-64 min-h-screen">
              {/* Mobile header with hamburger menu */}
              <div className="md:hidden sticky top-0 z-30 bg-dark-900 border-b border-white/10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                </div>
                
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-dark-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </ProtectedAdminRoute>
      )}
    </AdminProvider>
  )
}

