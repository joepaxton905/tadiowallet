'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/useUserData'

export default function Header({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(20)

  return (
    <header className="sticky top-0 h-20 bg-dark-950/80 backdrop-blur-xl border-b border-white/5" style={{ zIndex: 10 }}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-dark-400 hover:text-white transition-colors"
            onClick={onMenuClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets, transactions..."
                className="w-80 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-dark-500 bg-dark-800 rounded border border-white/10">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 text-dark-400 hover:text-white transition-colors"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Network Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-xs font-medium text-accent-400">Mainnet</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2.5 text-dark-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button 
                      onClick={() => markAllAsRead().catch(console.error)}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-dark-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id || notification.id}
                          onClick={() => !notification.read && markAsRead(notification._id).catch(console.error)}
                          className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-primary-500/5' : ''
                          }`}
                        >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'price_alert' ? 'bg-yellow-500/20 text-yellow-400' :
                            notification.type === 'transaction' ? 'bg-green-500/20 text-green-400' :
                            notification.type === 'security' ? 'bg-red-500/20 text-red-400' :
                            'bg-primary-500/20 text-primary-400'
                          }`}>
                            {notification.type === 'price_alert' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            )}
                            {notification.type === 'transaction' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {notification.type === 'security' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            )}
                            {notification.type === 'reward' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-dark-400 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-dark-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-white/5">
                    <button className="w-full text-center text-sm text-primary-400 hover:text-primary-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-sm font-medium text-dark-950 hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy Crypto
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
          <input
            type="text"
            placeholder="Search assets, transactions..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
            autoFocus
          />
          <svg
            className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}
    </header>
  )
}

