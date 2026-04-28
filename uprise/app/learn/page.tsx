'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { BottomNav } from '@/components/BottomNav';
import { INTEREST_TREE, getInterestLabel, getInterestEmoji } from '@/lib/interests';
import { Search, ChevronRight } from 'lucide-react';

export default function LearnPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-24">
      {/* Top nav */}
      <header className="top-nav">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Logo size="sm" />
          <span className="text-xs font-medium" style={{ color: '#E07A2F' }}>📚 Learn</span>
        </div>
      </header>

      <main className="px-5 pt-4 max-w-lg mx-auto space-y-5">
        {/* Search */}
        <div className="relative animate-fade-up">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B6B73' }} />
          <input
            type="text"
            placeholder="Explore topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Categories */}
        <div className="animate-fade-up" style={{ animationDelay: '30ms' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#A0A0A8' }}>Browse by Topic</h2>
          <div className="grid grid-cols-2 gap-3">
            {INTEREST_TREE.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCat(selectedCat === cat.key ? null : cat.key)}
                className="card card-hover p-4 text-left"
                style={{ borderColor: selectedCat === cat.key ? 'rgba(224,122,47,0.4)' : undefined }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs" style={{ color: '#6B6B73' }}>{cat.children?.length} topics</span>
                </div>
                <p className="text-sm font-semibold text-white">{cat.label}</p>
                {selectedCat === cat.key && cat.children && (
                  <div className="mt-3 pt-3 border-t border-white/6 space-y-1">
                    {cat.children.map((sub) => (
                      <p key={sub.key} className="text-xs" style={{ color: '#6B6B73' }}>
                        {sub.emoji} {sub.label}
                      </p>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* All subcategories flat view */}
        <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#A0A0A8' }}>All Topics</h2>
          <div className="space-y-2">
            {selectedCat
              ? INTEREST_TREE.find((c) => c.key === selectedCat)?.children?.map((sub) => (
                  <button
                    key={sub.key}
                    className="w-full card card-hover p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sub.emoji}</span>
                      <span className="text-sm font-medium text-white">{sub.label}</span>
                    </div>
                    <ChevronRight size={16} style={{ color: '#6B6B73' }} />
                  </button>
                ))
              : INTEREST_TREE.flatMap((cat) =>
                  (cat.children || []).map((sub) => (
                    <button
                      key={sub.key}
                      className="w-full card card-hover p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sub.emoji}</span>
                        <div>
                          <span className="text-sm font-medium text-white">{sub.label}</span>
                          <span className="text-xs ml-2" style={{ color: '#6B6B73' }}>{cat.label}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: '#6B6B73' }} />
                    </button>
                  ))
                )
            }
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
