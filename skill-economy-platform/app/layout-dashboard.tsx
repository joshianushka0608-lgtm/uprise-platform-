import Link from 'next/link'
import './globals.css'

export default function DashboardLayout({
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
          <div className="orb w-72 h-72 bg-neon-pink bottom-0 left-1/3 opacity-10" />

          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
