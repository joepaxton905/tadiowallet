'use client'

import { useState, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { config } from '@/lib/config'
import { useNotifications } from '@/hooks/useUserData'
import { useAuth } from '@/lib/authContext'

const pageNames = {
  '/dashboard': 'Dashboard',
  '/dashboard/portfolio': 'Portfolio',
  '/dashboard/trade': 'Trade',
  '/dashboard/send': 'Send',
  '/dashboard/receive': 'Receive',
  '/dashboard/transactions': 'Activity',
  '/dashboard/markets': 'Markets',
  '/dashboard/settings': 'Settings',
}

function MobileHeader() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications, unreadCount } = useNotifications(10)
  const { user } = useAuth()
  
  const pageName = pageNames[pathname] || 'Dashboard'
  const isHome = pathname === '/dashboard'

  // Get user initials (e.g., "John Doe" => "JD")
  const getUserInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || ''
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || ''
    return `${firstInitial}${lastInitial}` || 'U'
  }

  return (
    <header className="sticky top-0 z-40 lg:hidden">
      <div className="bg-dark-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          {isHome ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-heading font-bold text-white">{config.companyName}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard"
                className="p-2 -ml-2 text-dark-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="font-semibold text-white">{pageName}</h1>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Link 
              href="/dashboard/markets"
              className="p-2 text-dark-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <button 
              className="relative p-2 text-dark-400 hover:text-white transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link 
              href="/dashboard/settings"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center border border-white/10"
              title={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
            >
              <span className="text-xs font-medium text-white">{getUserInitials()}</span>
            </Link>
          </div>
        </div>
      </div>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute top-full right-4 left-4 mt-2 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[70vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="font-semibold text-white">Notifications</h3>
              <button className="text-xs text-primary-400 hover:text-primary-300">
                Mark all read
              </button>
            </div>
            <div className="overflow-y-auto max-h-80">
              {notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-white/5 active:bg-white/5 ${
                    !notification.read ? 'bg-primary-500/5' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-white">{notification.title}</p>
                  <p className="text-xs text-dark-400 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-dark-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <Link 
                href="/dashboard/transactions"
                className="block w-full text-center text-sm text-primary-400 active:text-primary-300"
                onClick={() => setShowNotifications(false)}
              >
                View all activity
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(MobileHeader)
