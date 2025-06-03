'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requireRole,
  fallback = <div>Loading...</div> 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login')
    }
  }, [isInitialized, isAuthenticated, router])

  if (!isInitialized) {
    return <>{fallback}</>
  }

  if (!isAuthenticated || !user) {
    return <>{fallback}</>
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}