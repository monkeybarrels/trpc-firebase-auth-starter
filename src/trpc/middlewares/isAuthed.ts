import { TRPCError } from '@trpc/server'
import { adminAuth } from '@/lib/firebase-admin'
import type { Context } from '../context'

type AuthedContext = Omit<Context, 'user'> & {
  user: NonNullable<Context['user']>
}

export const isAuthed = async ({ ctx, next }: { ctx: Context, next: any }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    })
  }

  try {
    const authHeader = ctx.req?.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED',
        message: 'No authentication token provided'
      })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    if (!decodedToken || decodedToken.uid !== ctx.user.id) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED',
        message: 'Invalid authentication token'
      })
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      } as AuthedContext,
    })
  } catch (error: any) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'Authentication failed'
    })
  }
}