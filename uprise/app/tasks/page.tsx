'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { BottomNav } from '@/components/BottomNav';
import { INTEREST_TREE, getInterestEmoji } from '@/lib/interests';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-24">
      {/* Top nav */}
      <header className="top-nav">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Logo size="sm" />
          <span className="text-xs font-medium" style={{ color: '#E07A2F' }}>📋 Tasks</span>
        </div>
      </header>

      <main className="px-5 py-4 max-w-lg mx-auto space-y-4">
        {/* Search */}
        <div className="relative animate-fade-up">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B6B73' }} />
          <input
            type="text"
            placeholder="Search by skill, subject, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category filter */}
        <div className="overflow-x-auto hide-scrollbar pb-1 animate-fade-up" style={{ animationDelay: '30ms' }}>
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCat(null)}
              className={`cat-chip ${!selectedCat ? 'selected' : ''}`}
            >
              All
            </button>
            {INTEREST_TREE.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCat(selectedCat === cat.key ? null : cat.key)}
                className={`cat-chip ${selectedCat === cat.key ? 'selected' : ''}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between animate-fade-up" style={{ animationDelay: '60ms' }}>
          <p className="text-xs" style={{ color: '#6B6B73' }}>No tasks found</p>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#E07A2F' }}>
            <SlidersHorizontal size={12} /> Filter
          </button>
        </div>

        {/* Empty state — no fake data */}
        <div className="empty-state animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="empty-icon">📋</div>
          <h3 className="text-sm font-semibold text-white mb-1">No tasks yet</h3>
          <p className="text-xs" style={{ color: '#6B6B73', maxWidth: 240 }}>
            Tasks posted by students will appear here. Be the first to post one.
          </p>
          <Link href="/tasks/create">
            <button className="btn-orange px-5 py-2.5 text-sm mt-4">
              Post a Task
            </button>
          </Link>
        </div>
      </main>

      {/* FAB */}
      <Link href="/tasks/create">
        <button
          className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white z-40"
          style={{ background: 'linear-gradient(135deg, #E07A2F, #F09040)', boxShadow: '0 4px 20px rgba(224,122,47,0.4)' }}
        >
          <Plus size={24} />
        </button>
      </Link>

      <BottomNav />
    </div>
  );
}
