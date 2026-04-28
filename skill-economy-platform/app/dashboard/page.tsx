'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { StatsCard, RoleSwitcher, EmptyState } from '@/components/StatsCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskCard } from '@/components/TaskCard';
import { formatCurrency, cn } from '@/lib/utils';

// Demo users — role from localStorage
const DEMO_NAMES: Record<string, string> = {
  earner: 'Priya Sharma',
  learner: 'Rahul Mehta',
  mentor: 'Neha Kapoor',
};

const getInitialRole = (): 'learner' | 'earner' | 'mentor' => {
  if (typeof window === 'undefined') return 'earner';
  return (localStorage.getItem('demo_role') as 'learner' | 'earner' | 'mentor') || 'earner';
};

const MOCK_USER = {
  name: DEMO_NAMES[getInitialRole()] || 'Anushka',
  role: getInitialRole(),
  stats: { earnings: 24500, projects_posted: 5, projects_done: 8, skills: 12, rating: 4.8, mentees: 3 },
};

const MOCK_PROJECTS = [
  { id: '1', title: 'Math notes for Grade 10 — Chapter 1 to 5', description: 'Handwritten CBSE Math notes, Chapters 1-5.', category: 'writing', base_budget: 800, final_budget: 1000, deadline: '2026-04-29', complexity: 'medium' as const, status: 'open', delivery_type: 'physical' as const, poster: { id: 'u1', name: 'Vikram M.', rating: 4.9, area: 'Andheri West, Mumbai' }, bids_count: 7, skills: ['Mathematics', 'Notes', 'CBSE'] },
  { id: '3', title: 'Physics practical file — Class 12', description: 'Complete CBSE Class 12 physics practical file, all 15 experiments.', category: 'data', base_budget: 1500, final_budget: 2000, deadline: '2026-05-01', complexity: 'medium' as const, status: 'in_progress', delivery_type: 'physical' as const, poster: { id: 'u3', name: 'Arjun N.', rating: 5.0, area: 'Koramangala, Bangalore' }, bids_count: 12, skills: ['Physics', 'Practical', 'CBSE'] },
];

const UPCOMING_DEADLINES = [
  { id: '1', title: 'Math notes — Ch 1-5', deadline: '2026-04-29', status: 'In Progress', amount: 800 },
  { id: '3', title: 'Physics practical file', deadline: '2026-05-01', status: 'Pending', amount: 1500 },
  { id: '2', title: 'Essay on AI in Education', deadline: '2026-04-30', status: 'Applied', amount: 1200 },
];

const UPCOMING_SESSIONS = [
  { id: '1', mentor: 'Neha Kapoor', topic: 'PM Interview Prep', date: '2026-04-27', time: '3:00 PM' },
  { id: '2', mentor: 'Ravi Shankar', topic: 'System Design', date: '2026-04-29', time: '11:00 AM' },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'project', text: 'New application on "Math notes Grade 10"', time: '2h ago', unread: true },
  { id: 'n2', type: 'payment', text: '₹900 received for "Physics practical"', time: '5h ago', unread: true },
  { id: 'n3', type: 'mentor', text: 'Neha Kapoor confirmed your session', time: '1d ago', unread: false },
];

export default function DashboardPage() {
  const [role, setRole] = useState<'learner' | 'earner' | 'mentor'>(MOCK_USER.role);
  const [userName, setUserName] = useState(MOCK_USER.name);
  const [loading] = useState(false);

  const handleRoleSwitch = (newRole: 'learner' | 'earner' | 'mentor') => {
    setRole(newRole);
    setUserName(DEMO_NAMES[newRole]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_role', newRole);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNav />

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-6">
        {/* Greeting */}
        <div className="animate-slide-up">
          <p className="text-gray-400 text-sm">Good morning,</p>
          <h1 className="text-2xl font-bold text-white">{userName} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your work today.</p>
        </div>

        {/* Role Switcher */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <RoleSwitcher role={role} onSwitch={handleRoleSwitch} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {role === 'earner' && (
            <>
              <StatsCard label="Earned" value={formatCurrency(MOCK_USER.stats.earnings)} icon="💰" gradient="from-emerald-500 to-green-500" />
              <StatsCard label="Projects Done" value={MOCK_USER.stats.projects_done} icon="✅" gradient="from-blue-500 to-cyan-500" />
              <StatsCard label="Skills" value={MOCK_USER.stats.skills} icon="🧠" gradient="from-neon-purple to-pink-500" />
              <StatsCard label="Rating" value={`${MOCK_USER.stats.rating}★`} icon="⭐" gradient="from-amber-500 to-orange-500" />
            </>
          )}
          {role === 'learner' && (
            <>
              <StatsCard label="Mentors" value="12" icon="🎓" gradient="from-blue-500 to-cyan-500" />
              <StatsCard label="Sessions" value="5" icon="📅" gradient="from-neon-purple to-pink-500" />
              <StatsCard label="Skills" value={MOCK_USER.stats.skills} icon="🧠" gradient="from-emerald-500 to-green-500" />
              <StatsCard label="Rating" value={`${MOCK_USER.stats.rating}★`} icon="⭐" gradient="from-amber-500 to-orange-500" />
            </>
          )}
          {role === 'mentor' && (
            <>
              <StatsCard label="Mentees" value={MOCK_USER.stats.mentees} icon="👥" gradient="from-neon-purple to-pink-500" />
              <StatsCard label="Sessions" value="24" icon="📅" gradient="from-blue-500 to-cyan-500" />
              <StatsCard label="Earned" value={formatCurrency(MOCK_USER.stats.earnings)} icon="💰" gradient="from-emerald-500 to-green-500" />
              <StatsCard label="Rating" value={`${MOCK_USER.stats.rating}★`} icon="⭐" gradient="from-amber-500 to-orange-500" />
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">Notifications</h2>
            <Badge variant="success" size="sm">{MOCK_NOTIFICATIONS.filter((n) => n.unread).length} new</Badge>
          </div>
          <div className="space-y-2">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div key={n.id} className={cn('flex items-start gap-3 p-2 rounded-xl', n.unread ? 'bg-brand-500/5' : '')}>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm', n.type === 'project' ? 'bg-blue-500/20 text-blue-400' : n.type === 'payment' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400')}>
                  {n.type === 'project' ? '📋' : n.type === 'payment' ? '💰' : '🎓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {role === 'earner' && (
            <>
              <Link href="/tasks/create">
                <Button className="w-full h-14 flex-col gap-1" variant="primary">
                  <span className="text-lg">+</span>
                  <span className="text-[10px]">Post Project</span>
                </Button>
              </Link>
              <Link href="/tasks">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">🔍</span>
                  <span className="text-[10px]">Browse</span>
                </Button>
              </Link>
              <Link href="/mentors">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">🎓</span>
                  <span className="text-[10px]">Mentors</span>
                </Button>
              </Link>
            </>
          )}
          {role === 'learner' && (
            <>
              <Link href="/tasks">
                <Button className="w-full h-14 flex-col gap-1" variant="primary">
                  <span className="text-lg">🔍</span>
                  <span className="text-[10px]">Browse Work</span>
                </Button>
              </Link>
              <Link href="/mentors">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">🎓</span>
                  <span className="text-[10px]">Find Mentor</span>
                </Button>
              </Link>
              <Link href="/tasks/create">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">+</span>
                  <span className="text-[10px]">Post Project</span>
                </Button>
              </Link>
            </>
          )}
          {role === 'mentor' && (
            <>
              <Link href="/mentorship">
                <Button className="w-full h-14 flex-col gap-1" variant="primary">
                  <span className="text-lg">📅</span>
                  <span className="text-[10px]">My Sessions</span>
                </Button>
              </Link>
              <Link href="/tasks">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">👥</span>
                  <span className="text-[10px]">Mentees</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="w-full h-14 flex-col gap-1" variant="secondary">
                  <span className="text-lg">📊</span>
                  <span className="text-[10px]">Earnings</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white text-base">📅 Upcoming Deadlines</h2>
          </div>
          <div className="space-y-2">
            {UPCOMING_DEADLINES.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-neon-purple/20 flex items-center justify-center text-lg">📋</div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">Due {item.deadline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={item.status === 'In Progress' ? 'info' : item.status === 'Pending' ? 'warning' : 'success'} size="sm">{item.status}</Badge>
                  <p className="text-xs text-neon-green mt-1">₹{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Projects */}
        {(role === 'earner' || role === 'learner') && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-base">Recommended Projects</h2>
              <Link href="/tasks" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">See all →</Link>
            </div>
            <div className="space-y-3">
              {MOCK_PROJECTS.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Mentorship Sessions */}
        {role === 'learner' && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-base">🎓 Upcoming Sessions</h2>
              <Link href="/mentorship" className="text-sm text-brand-400 hover:text-brand-300">See all →</Link>
            </div>
            <div className="space-y-2">
              {UPCOMING_SESSIONS.map((s) => (
                <div key={s.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white font-bold text-sm">{s.mentor[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{s.mentor}</p>
                    <p className="text-xs text-gray-500">{s.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white">{s.date}</p>
                    <p className="text-xs text-gray-500">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentor Dashboard */}
        {role === 'mentor' && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '350ms' }}>
            <h2 className="font-semibold text-white text-base">Your Mentees</h2>
            {[
              { name: 'Rahul M.', topic: 'PM Interviews', progress: 60 },
              { name: 'Sneha K.', topic: 'Portfolio Building', progress: 40 },
              { name: 'Arjun T.', topic: 'System Design', progress: 20 },
            ].map((m) => (
              <div key={m.name} className="glass-card rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">{m.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.topic}</p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-400">{m.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full">
                  <div className="h-1.5 bg-brand-500 rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}
