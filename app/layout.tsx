import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'NEXA Pay - Tap. Pay. Crypto Made Easy.',
  description: 'The next generation of crypto payments. Fast. Secure. Borderless. Pay anywhere instantly with your crypto using NFC tap-to-pay technology.',
  keywords: ['crypto payments', 'NFC payments', 'digital wallet', 'cryptocurrency', 'fintech', 'tap to pay'],
  openGraph: {
    title: 'NEXA Pay - Tap. Pay. Crypto Made Easy.',
    description: 'The next generation of crypto payments. Fast. Secure. Borderless.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
