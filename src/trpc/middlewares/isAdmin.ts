import { middleware } from '../index'
import { TRPCError } from '@trpc/server'

export const isAdmin = middleware(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required' 
    })
  }
  return next()
})