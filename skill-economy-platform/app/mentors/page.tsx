'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { MentorCard } from '@/components/MentorCard';
import { EmptyState } from '@/components/StatsCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const MOCK_MENTORS = [
  { id: 'm1', user: { id: 'm1', name: 'Neha Kapoor', headline: 'Senior PM @ Razorpay', bio: '5+ years in product management. Previously at Swiggy. Passionate about mentoring the next generation of product managers.', avatar_url: '' }, skills: ['Product Management', 'Strategy', 'User Research', 'Analytics', 'A/B Testing'], session_price: 1500, avg_rating: 4.9, total_sessions: 124, verified: true },
  { id: 'm2', user: { id: 'm2', name: 'Ravi Shankar', headline: 'Senior Engineer @ Google', bio: 'Ex-Amazon SDE. Built systems at scale. I help students crack interviews and become better engineers.', avatar_url: '' }, skills: ['System Design', 'Python', 'JavaScript', 'Algorithms', 'DSA'], session_price: 2000, avg_rating: 4.8, total_sessions: 89, verified: true },
  { id: 'm3', user: { id: 'm3', name: 'Ananya Singh', headline: 'UX Lead @ CRED', bio: '8 years in design. I can help you build a strong design portfolio and master Figma.', avatar_url: '' }, skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Testing', 'Design Systems'], session_price: 1200, avg_rating: 4.7, total_sessions: 156, verified: true },
  { id: 'm4', user: { id: 'm4', name: 'Arjun Mehta', headline: 'Startup Founder & Angel', bio: 'Built 2 startups, 1 exit. Happy to share what I know about entrepreneurship, fundraising, and growth.', avatar_url: '' }, skills: ['Startups', 'Fundraising', 'Growth', 'Business Strategy', 'Pitch Decks'], session_price: 2500, avg_rating: 4.9, total_sessions: 45, verified: true },
  { id: 'm5', user: { id: 'm5', name: 'Priya Nair', headline: 'Content Strategist @ Dunzo', bio: 'Writing for 6 years across fintech, foodtech, and D2C. Can help with content, SEO, and social media strategy.', avatar_url: '' }, skills: ['Content Writing', 'SEO', 'Social Media', 'Copywriting', 'Email Marketing'], session_price: 800, avg_rating: 4.6, total_sessions: 78, verified: false },
  { id: 'm6', user: { id: 'm6', name: 'Karthik R.', headline: 'Data Scientist @ Netflix', bio: 'ML/AI specialist. I help students break into data science and AI. Python, ML, deep learning.', avatar_url: '' }, skills: ['Machine Learning', 'Python', 'Deep Learning', 'NLP', 'Data Analysis'], session_price: 1800, avg_rating: 4.8, total_sessions: 62, verified: true },
];

const FILTERS = ['All', 'Design', 'Development', 'Product', 'Marketing', 'Data'];

export default function MentorsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Find a Mentor" />

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative animate-slide-up">
          <input
            type="text"
            placeholder="Search mentors by skill or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                filter === f ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* AI Recommended */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-semibold text-white text-base">AI Recommended for You</h2>
            <Badge variant="gradient" size="sm">✨</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_MENTORS.slice(0, 2).map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        </div>

        {/* All Mentors */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h2 className="font-semibold text-white text-base">All Mentors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_MENTORS.slice(2).map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
}