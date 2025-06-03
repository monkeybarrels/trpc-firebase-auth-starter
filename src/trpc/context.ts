// src/trpc/context.ts - Alternative better approach
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// Define the authenticated user type
interface AuthenticatedUser {
  id: string
  email: string
  role: string
}

// Base context that's always the same shape
interface BaseContext {
  req: Request
  user: AuthenticatedUser | null
}

export async function createContext({ req }: { req: Request }): Promise<BaseContext> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const userId = cookieStore.get('x-user-id')?.value

  // Early return with null user if no auth data
  if (!token || !userId) {
    return { 
      user: null, 
      req 
    }
  }

  try {
    // Verify the token with Firebase Admin
    const decoded = await adminAuth.verifyIdToken(token)
    
    // Validate token matches cookie
    if (decoded.uid !== userId) {
      console.error('Token UID mismatch')
      return { 
        user: null, 
        req 
      }
    }

    // Ensure we have an email (Firebase should always provide this)
    if (!decoded.email) {
      console.error('No email in Firebase token')
      return { 
        user: null, 
        req 
      }
    }

    // Get additional user data from Firestore
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get()
    const userData = userDoc.data()

    // Return authenticated user
    return {
      req,
      user: {
        id: decoded.uid,
        email: decoded.email, // Now guaranteed to exist
        role: userData?.role || 'user',
      },
    }
  } catch (error) {
    console.error('Error in createContext:', error)
    return { 
      user: null, 
      req 
    }
  }
}

// Export the type for use in other files
export type Context = BaseContext