'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge, SkillBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { formatCurrency, cn } from '@/lib/utils';

const MOCK_PROFILE = {
  name: 'Anushka Joshi',
  email: 'anushka@resob.ai',
  bio: 'Building Resob.ai & Corntub. BBA student exploring product, tech & design. Love building things that matter.',
  role: 'earner' as const,
  verified: true,
  location: 'Mumbai, India',
  joined: 'Jan 2026',
  stats: { earnings: 24500, tasks: 8, hours: 42, rating: 4.8, reviews: 6 },
  skills: [
    { name: 'Product Management', level: 'intermediate' as const },
    { name: 'UI/UX Design', level: 'intermediate' as const },
    { name: 'Content Writing', level: 'expert' as const },
    { name: 'React', level: 'beginner' as const },
    { name: 'Figma', level: 'intermediate' as const },
    { name: 'Copywriting', level: 'expert' as const },
    { name: 'Social Media', level: 'intermediate' as const },
  ],
  badges: [
    { name: 'Quick Starter', emoji: '⚡', desc: 'Completed 5 tasks in first month' },
    { name: 'Top Earner', emoji: '💰', desc: 'Earned ₹10K+ in first month' },
    { name: 'Verified', emoji: '✓', desc: 'Identity verified' },
  ],
  portfolio: [
    { id: 'p1', title: 'Resob.ai Landing Page', desc: 'Designed and built the full landing page for our AI startup', skills: ['Figma', 'React', 'Copywriting'], completed: '2026-03', earnings: 8000, rating: 5 },
    { id: 'p2', title: 'Corntub Product Strategy Doc', desc: 'Created a comprehensive product strategy and user research document', skills: ['Product Management', 'Research'], completed: '2026-02', earnings: 5000, rating: 5 },
    { id: 'p3', title: 'Instagram Content Calendar', desc: '30-day content strategy for a D2C brand', skills: ['Content Writing', 'Social Media'], completed: '2026-01', earnings: 3000, rating: 4.5 },
  ],
};

const TABS = ['Overview', 'Portfolio', 'Earnings', 'Reviews'];

export default function ProfilePage() {
  const [tab, setTab] = useState('Overview');
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Profile" />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-5 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white text-xl font-bold">
                {MOCK_PROFILE.name[0]}
              </div>
              {MOCK_PROFILE.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neon-green flex items-center justify-center text-[8px] text-black font-bold">
                  ✓
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white">{MOCK_PROFILE.name}</h1>
              <p className="text-sm text-gray-400">{MOCK_PROFILE.email}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>📍 {MOCK_PROFILE.location}</span>
                <span>•</span>
                <span>Joined {MOCK_PROFILE.joined}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              ✏️
            </Button>
          </div>

          {editMode ? (
            <div className="mt-4 space-y-3">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:border-brand-500/50 transition-all min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setEditMode(false); showToast('Profile updated!', 'success'); }}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300 mt-3">{bio}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {MOCK_PROFILE.badges.map((badge) => (
              <div key={badge.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span>{badge.emoji}</span>
                <span className="text-xs font-medium text-white">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-neon-green">{formatCurrency(MOCK_PROFILE.stats.earnings)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Earned</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-white">{MOCK_PROFILE.stats.tasks}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tasks Done</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-white">{MOCK_PROFILE.stats.hours}h</p>
            <p className="text-xs text-gray-500 mt-0.5">Work Hours</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{MOCK_PROFILE.stats.rating}★</p>
            <p className="text-xs text-gray-500 mt-0.5">{MOCK_PROFILE.stats.reviews} reviews</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Skills */}
        {tab === 'Overview' && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <Card>
              <h3 className="font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_PROFILE.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill.name} level={skill.level} />
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="md" className="text-xs">
                  📂 View Public Portfolio
                </Button>
                <Button variant="secondary" size="md" className="text-xs">
                  💳 Withdraw Earnings
                </Button>
                <Button variant="secondary" size="md" className="text-xs">
                  ⚙️ Edit Skills
                </Button>
                <Button variant="secondary" size="md" className="text-xs">
                  📤 Share Profile
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Portfolio Tab */}
        {tab === 'Portfolio' && (
          <div className="space-y-3 animate-slide-up">
            {MOCK_PROFILE.portfolio.map((item) => (
              <Card key={item.id} hover>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <Badge variant="success" size="sm">{formatCurrency(item.earnings)}</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {item.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                  <span>Completed {item.completed}</span>
                  <span className="text-amber-400">★ {item.rating}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Earnings Tab */}
        {tab === 'Earnings' && (
          <div className="space-y-3 animate-slide-up">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-2xl font-black text-neon-green">{formatCurrency(MOCK_PROFILE.stats.earnings)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-sm font-medium text-amber-400">{formatCurrency(500)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-500">In Escrow</p>
                  <p className="text-sm font-medium text-blue-400">{formatCurrency(1500)}</p>
                </div>
              </div>
              <Button className="w-full mt-3" variant="primary">
                💸 Withdraw to Bank
              </Button>
            </Card>

            {[
              { date: '2026-04-24', task: 'Logo design for startup', amount: 3000, type: 'earned' },
              { date: '2026-04-20', task: 'UI Dashboard', amount: 5500, type: 'earned' },
              { date: '2026-04-15', task: 'Blog posts on fintech', amount: 2000, type: 'earned' },
              { date: '2026-04-10', task: 'Platform fee (10%)', amount: -1050, type: 'fee' },
            ].map((tx, i) => (
              <div key={i} className="glass-card rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{tx.task}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <span className={cn('text-sm font-medium', tx.amount > 0 ? 'text-neon-green' : 'text-gray-400')}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {tab === 'Reviews' && (
          <div className="space-y-3 animate-slide-up">
            {[5, 5, 4.5, 5, 5].map((rating, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">
                    {['V', 'A', 'S', 'R', 'K'][i]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{['Vikram M.', 'Aditya S.', 'Sarah C.', 'Riya P.', 'Kavya R.'][i]}</p>
                    <p className="text-xs text-gray-500">{['Logo design', 'UI dashboard', 'Blog posts', 'Reels', 'Pitch deck'][i]}</p>
                  </div>
                  <span className="text-sm text-amber-400">★ {rating}</span>
                </div>
                <p className="text-xs text-gray-400 ml-10">
                  {['Excellent work, very professional!', 'Great communication and on time.', 'Very creative, exceeded expectations!', 'Quick turnaround, good quality.', 'Perfect execution! Will hire again.'][i]}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}