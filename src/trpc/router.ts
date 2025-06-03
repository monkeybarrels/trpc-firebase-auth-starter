import { router } from './index'
import { authRouter } from './routers/auth'
import { userRouter } from './routers/user'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter