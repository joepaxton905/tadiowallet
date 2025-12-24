'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import MobileHeader from '@/components/dashboard/MobileHeader'
import BottomNav from '@/components/dashboard/BottomNav'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-dark-950">
        {/* Sidebar - Always visible on desktop (fixed), toggle on mobile */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content - Adjusted for fixed sidebar on desktop */}
        <div className="flex flex-col min-h-screen lg:ml-72 relative" style={{ zIndex: 1 }}>
          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden lg:block">
            <Header onMenuClick={() => setSidebarOpen(true)} />
          </div>
          
          {/* Mobile Header - Hidden on desktop */}
          <MobileHeader />
          
          {/* Page Content - Extra padding at bottom for mobile nav */}
          <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto mobile-no-scrollbar">
            {children}
          </main>
          
          {/* Bottom Navigation - Mobile only */}
          <BottomNav />
        </div>
      </div>
    </ProtectedRoute>
  )
}
