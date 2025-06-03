import { router, protectedProcedure } from '../index'
import { adminDb } from '@/lib/firebase-admin'
import { z } from 'zod'

export const userRouter = router({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new Error('User not authenticated')
      }
      const userDoc = await adminDb.collection('users').doc(ctx.user.id).get()
      const userData = userDoc.data()
      
      return {
        id: ctx.user.id,
        email: ctx.user.email,
        role: ctx.user.role,
        displayName: userData?.displayName,
        createdAt: userData?.createdAt?.toDate(),
      }
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error('User not authenticated')
      }
      await adminDb.collection('users').doc(ctx.user.id).update({
        ...input,
        updatedAt: new Date(),
      })

      return { success: true }
    }),
})