import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import { isAuthed } from './middlewares/isAuthed'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(middleware(isAuthed))