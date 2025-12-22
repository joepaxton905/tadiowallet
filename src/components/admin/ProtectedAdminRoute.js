'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/lib/adminContext'

export default function ProtectedAdminRoute({ children }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAdmin()

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!isAuthenticated()) {
    return null
  }

  return children
}

