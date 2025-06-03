import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TRPCProvider } from '@/providers/trpc-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tRPC Firebase Auth Starter',
  description: 'Production-ready authentication with tRPC and Firebase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}