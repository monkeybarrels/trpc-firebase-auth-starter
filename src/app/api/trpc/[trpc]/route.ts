// app/api/trpc/[trpc]/route.ts (or src/app/api/trpc/[trpc]/route.ts)
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc/router'
import { createContext } from '@/trpc/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }