import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SkillEdge — Your Skills Are Your Resume',
  description: 'Earn, Learn, and Prove It. The student skill economy platform connecting talent with opportunities.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SkillEdge',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="animated-bg min-h-screen antialiased">
        <div className="relative z-0">
          {/* Background orbs */}
          <div className="orb w-96 h-96 bg-brand-600 top-0 left-0 opacity-20" />
          <div className="orb w-80 h-80 bg-neon-purple top-1/3 right-0 opacity-15" />
          <div className="orb w-72 h-72 bg-neon-pink bottom-0 left-1/3 opacity-10" />

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
