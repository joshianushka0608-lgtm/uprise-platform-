import Link from 'next/link'
import './globals.css'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="animated-bg min-h-screen antialiased">
        <div className="relative z-0">
          <div className="orb w-96 h-96 bg-brand-600 top-0 left-0 opacity-20" />
          <div className="orb w-80 h-80 bg-neon-purple top-1/3 right-0 opacity-15" />

          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SE</span>
                </div>
                <span className="font-bold text-white text-lg">SkillEdge</span>
              </Link>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Back to home
              </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
