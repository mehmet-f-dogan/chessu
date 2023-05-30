import './globals.css'
import { Rubik } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const rubikFont = Rubik({ subsets: ['latin'] })

export const metadata = {
  title: 'ChessU',
  description: 'Chess course platform for chess masters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const globalLayout = `${rubikFont.className} bg-black text-white`

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={globalLayout}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
