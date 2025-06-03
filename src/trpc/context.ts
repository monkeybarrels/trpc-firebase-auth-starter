import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function createContext({ req }: { req: Request }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const userId = cookieStore.get('x-user-id')?.value

  try {
    if (!token || !userId) {
      return { user: null, req }
    }

    const decoded = await adminAuth.verifyIdToken(token)
    
    if (decoded.uid !== userId) {
      return { user: null, req }
    }

    const userDoc = await adminDb.collection('users').doc(decoded.uid).get()
    const userData = userDoc.data()

    return {
      req,
      user: {
        id: decoded.uid,
        email: decoded.email,
        role: userData?.role || 'user',
      },
    }
  } catch (error) {
    console.error('Error in createContext:', error)
    return { user: null, req }
  }
}

export type Context = {
  req: Request
  user: {
    id: string
    email: string
    role: string
  } | null
}