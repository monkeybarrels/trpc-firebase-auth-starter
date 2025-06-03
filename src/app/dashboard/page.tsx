'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/trpc/client'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = trpc.user.me.useQuery(undefined, {
    enabled: !!user,
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.email}!
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Authentication Success!
              </h2>
              
              {isLoading ? (
                <p>Loading profile...</p>
              ) : profile ? (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {profile.id}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> {profile.role}</p>
                </div>
              ) : (
                <p>No profile data available</p>
              )}

              <div className="mt-8 bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-green-800">
                  ✅ What's Working:
                </h3>
                <ul className="text-green-700 text-sm mt-2 space-y-1">
                  <li>• HTTP-only cookies (check your browser dev tools)</li>
                  <li>• Server-side token verification</li>
                  <li>• Type-safe tRPC procedures</li>
                  <li>• Real-time auth state with Zustand</li>
                  <li>• Route protection</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}