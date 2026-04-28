'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { TaskCard } from '@/components/TaskCard';
import { TaskCardSkeleton, EmptyState } from '@/components/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { CATEGORIES, cn } from '@/lib/utils';

const MOCK_TASKS = [
  { id: '1', title: 'Math notes for Grade 10 — Chapter 1 to 5', description: 'Handwritten notes for Grade 10 Math, CBSE syllabus. Chapters 1-5. Neat handwriting required.', category: 'writing', base_budget: 800, final_budget: 1000, deadline: '2026-04-29', complexity: 'medium' as const, status: 'open', delivery_type: 'physical' as const, poster: { id: 'u1', name: 'Vikram M.', rating: 4.9, area: 'Andheri West, Mumbai' }, bids_count: 7, skills: ['Mathematics', 'Notes', 'CBSE'] },
  { id: '2', title: 'Essay on "Impact of AI on Education" — College', description: '1500-word essay for BA English. Academic writing, no plagiarism. References required.', category: 'writing', base_budget: 1200, final_budget: 1500, deadline: '2026-05-02', complexity: 'medium' as const, status: 'open', delivery_type: 'online' as const, poster: { id: 'u2', name: 'Sarah C.', rating: 4.7, area: '' }, bids_count: 3, skills: ['Essay Writing', 'AI', 'Academic'] },
  { id: '3', title: 'Physics practical file — Class 12', description: 'Complete physics practical file for CBSE Class 12. All 15 experiments with proper format.', category: 'data', base_budget: 1500, final_budget: 2000, deadline: '2026-05-01', complexity: 'medium' as const, status: 'open', delivery_type: 'physical' as const, poster: { id: 'u3', name: 'Arjun N.', rating: 5.0, area: 'Koramangala, Bangalore' }, bids_count: 12, skills: ['Physics', 'Practical', 'CBSE'] },
  { id: '4', title: 'Build a simple portfolio website', description: 'Single page portfolio with HTML/CSS. Name, photo, skills, contact form. Basic design.', category: 'development', base_budget: 2000, final_budget: 3000, deadline: '2026-05-05', complexity: 'high' as const, status: 'open', delivery_type: 'online' as const, poster: { id: 'u4', name: 'Riya P.', rating: 4.5, area: '' }, bids_count: 5, skills: ['HTML', 'CSS', 'Web Development'] },
  { id: '5', title: 'Chemistry notes — Organic Chemistry, Grade 11', description: 'Handwritten or printed notes for Grade 11 Chemistry. Organic chemistry portion only. Diagrams needed.', category: 'writing', base_budget: 600, final_budget: 800, deadline: '2026-04-28', complexity: 'low' as const, status: 'open', delivery_type: 'physical' as const, poster: { id: 'u5', name: 'Aditya S.', rating: 4.2, area: 'Salt Lake, Kolkata' }, bids_count: 18, skills: ['Chemistry', 'Notes', 'Organic'] },
  { id: '6', title: 'Logo design for college project', description: 'Modern minimalist logo for a college entrepreneurship project. Needs to look professional.', category: 'design', base_budget: 1000, final_budget: 1500, deadline: '2026-05-03', complexity: 'medium' as const, status: 'open', delivery_type: 'online' as const, poster: { id: 'u6', name: 'Kavya R.', rating: 4.8, area: '' }, bids_count: 9, skills: ['Logo Design', 'Figma', 'Branding'] },
  { id: '7', title: 'Summary of "Wings of Fire" — 5 pages', description: '5-page summary of APJ Abdul Kalam\'s Wings of Fire. Simple language, chapter-wise highlights.', category: 'writing', base_budget: 400, final_budget: 500, deadline: '2026-04-30', complexity: 'low' as const, status: 'open', delivery_type: 'both' as const, poster: { id: 'u7', name: 'Neha K.', rating: 4.6, area: 'Pune' }, bids_count: 11, skills: ['Summary', 'English', 'Book Notes'] },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'budget_high', label: 'Budget: High → Low' },
  { value: 'budget_low', label: 'Budget: Low → High' },
];

const DELIVERY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'online', label: '🌐 Online' },
  { value: 'physical', label: '📦 Physical' },
];

export default function BrowseTasksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const filteredTasks = MOCK_TASKS.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchDel = deliveryFilter === 'all' || t.delivery_type === deliveryFilter || t.delivery_type === 'both';
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchPrice = (!priceMin || t.base_budget >= Number(priceMin)) &&
      (!priceMax || t.base_budget <= Number(priceMax));
    return matchCat && matchDel && matchSearch && matchPrice;
  });

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Assignments & Projects" />

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative animate-slide-up">
          <input
            type="text"
            placeholder="Search by subject, skill, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>

        {/* Delivery type filter */}
        <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '30ms' }}>
          {DELIVERY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setDeliveryFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                deliveryFilter === f.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'ml-auto px-4 py-2 rounded-xl text-sm font-medium transition-all',
              showFilters ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-gray-400 hover:text-white'
            )}
          >
            ⚙️ Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-4 space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-brand-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 3000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-brand-500/50"
                />
              </div>
            </div>
            <button
              onClick={() => { setPriceMin(''); setPriceMax(''); setSelectedCategory('all'); }}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="overflow-x-auto hide-scrollbar animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex gap-2 pb-1 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                selectedCategory === 'all'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                  selectedCategory === cat.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                )}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-gray-400">
            {filteredTasks.length} project{filteredTasks.length !== 1 ? 's' : ''} found
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="No projects found"
            description="Try adjusting your filters or search term"
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link href="/tasks/create">
        <button className="fixed bottom-20 right-4 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center text-2xl hover:from-brand-500 hover:to-brand-400 transition-all z-30 animate-bounce-in">
          +
        </button>
      </Link>

      <Navbar />
    </div>
  );
}
