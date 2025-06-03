import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/user-store'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, setUser, clearUser } = useUserStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken(true)
          
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'user',
          }
          
          setUser(userData)
        } catch (error) {
          console.error('Error getting token:', error)
          clearUser()
        }
      } else {
        clearUser()
      }
      
      setIsInitialized(true)
      setIsLoading(false)
    })

    return unsubscribe
  }, [setUser, clearUser])

  const logout = async () => {
    try {
      setIsLoading(true)
      await auth.signOut()
      clearUser()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    logout,
  }
}