'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/tasks', label: 'Tasks', icon: '📋' },
  { href: '/mentors', label: 'Mentors', icon: '🎓' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      <div className="glass border-t border-white/5 px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all min-w-[60px]',
                  isActive
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function TopNav({ title, showBack = false }: { title?: string; showBack?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              ←
            </Link>
          )}
          {title ? (
            <h1 className="font-semibold text-white text-base">{title}</h1>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">SkillEdge</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <span className="text-sm">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-pink" />
          </button>

          {/* Profile dropdown */}
          <Link href="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
