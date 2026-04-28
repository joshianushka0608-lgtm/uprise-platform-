'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Briefcase, TrendingUp, DollarSign, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [identity, setIdentity] = useState<string>('student');
  const [name, setName] = useState('there');
  const [stats, setStats] = useState({ earnings: 0, completed: 0, applied: 0, available: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIdentity = localStorage.getItem('uprise_identity') || 'student';
      const storedName = localStorage.getItem('uprise_name') || 'there';
      setIdentity(storedIdentity);
      setName(storedName);
    }
  }, []);

  const isStudent = identity === 'student' || identity === 'both';
  const isMentor = identity === 'mentor' || identity === 'both';

  const statCards = [
    { label: 'Total Earned', value: `₹${stats.earnings.toLocaleString()}`, icon: DollarSign, color: '#E07A2F' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#22c55e' },
    { label: 'Applied', value: stats.applied, icon: Briefcase, color: '#3A86FF' },
    { label: 'Available', value: stats.available, icon: TrendingUp, color: '#a855f7' },
  ];

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="top-nav flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #E07A2F, #F09040)' }}
          >
            {name[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="px-5 py-5 space-y-6 max-w-lg mx-auto">
        {/* Greeting */}
        <div className="animate-fade-up">
          <p className="text-sm mb-1" style={{ color: '#6B6B73' }}>
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},
          </p>
          <h1 className="text-2xl font-bold text-white">
            {name === 'there' ? 'Welcome to UpRise' : name}
            <span style={{ color: '#E07A2F' }}> 👋</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B73' }}>
            {isStudent ? 'Ready to earn or learn today?' : isMentor ? 'Ready to guide some students?' : 'Set up your profile to get started.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '50ms' }}>
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: '#6B6B73' }}>{label}</p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Quick action — based on identity */}
        {(isStudent || identity === 'both') && (
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div
              className="rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, #E07A2F, #F09040)', boxShadow: '0 8px 30px rgba(224,122,47,0.3)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Find your next task
                  </p>
                  <h2 className="text-lg font-bold text-white mb-1">
                    {identity === 'both' ? 'Ready to earn?' : 'Start earning today'}
                  </h2>
                  <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Browse tasks that match your skills
                  </p>
                  <Link href="/tasks">
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold text-orange bg-white">
                      Browse Tasks →
                    </button>
                  </Link>
                </div>
                <div className="text-5xl">💰</div>
              </div>
            </div>
          </div>
        )}

        {identity === 'mentor' && (
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="card p-5" style={{ borderColor: 'rgba(58,134,255,0.3)', border: '1px solid rgba(58,134,255,0.3)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#3A86FF' }}>Mentor Dashboard</p>
                  <h2 className="text-lg font-bold text-white mb-1">Review applicants</h2>
                  <p className="text-xs mb-4" style={{ color: '#6B6B73' }}>You have students waiting for your guidance</p>
                  <Link href="/tasks">
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#3A86FF' }}>
                      View Tasks →
                    </button>
                  </Link>
                </div>
                <div className="text-5xl">🎯</div>
              </div>
            </div>
          </div>
        )}

        {/* Task sections */}
        {(isStudent || identity === 'both') && (
          <div className="space-y-3 animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">Available Tasks</h2>
              <Link href="/tasks" className="text-xs font-medium flex items-center gap-1" style={{ color: '#E07A2F' }}>
                See all <ChevronRight size={12} />
              </Link>
            </div>
            <EmptyState
              title="No tasks yet"
              description="Check back soon — new tasks are posted daily."
              action={
                <Link href="/tasks">
                  <button className="btn-orange px-5 py-2.5 text-sm mt-3">
                    Browse Tasks
                  </button>
                </Link>
              }
            />
          </div>
        )}

        {/* Applied tasks */}
        {(isStudent || identity === 'both') && (
          <div className="space-y-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">Your Applications</h2>
              <Link href="/tasks?filter=applied" className="text-xs font-medium flex items-center gap-1" style={{ color: '#E07A2F' }}>
                See all <ChevronRight size={12} />
              </Link>
            </div>
            <EmptyState
              title="No applications yet"
              description="Browse available tasks and apply to ones that match your skills."
              action={
                <Link href="/tasks">
                  <button className="btn-orange px-5 py-2.5 text-sm mt-3">
                    Find Tasks
                  </button>
                </Link>
              }
            />
          </div>
        )}

        {/* Post a task CTA */}
        {(identity === 'student' || identity === 'both') && (
          <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
            <Link href="/tasks/create">
              <div className="card card-hover p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(58,134,255,0.12)', border: '1px solid rgba(58,134,255,0.2)' }}>
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Get work done</p>
                    <p className="text-xs" style={{ color: '#6B6B73' }}>Post a task and hire a student</p>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: '#6B6B73' }} />
              </div>
            </Link>
          </div>
        )}

        {/* Learn section */}
        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">Learn & Explore</h2>
            <Link href="/learn" className="text-xs font-medium flex items-center gap-1" style={{ color: '#E07A2F' }}>
              All topics <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '📐', label: 'Math', color: '#E07A2F' },
              { emoji: '💻', label: 'Tech', color: '#3A86FF' },
              { emoji: '✍️', label: 'Writing', color: '#a855f7' },
            ].map((topic) => (
              <button
                key={topic.label}
                className="card card-hover p-3 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{topic.emoji}</span>
                <span className="text-xs font-medium" style={{ color: '#A0A0A8' }}>{topic.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs" style={{ color: '#6B6B73', maxWidth: 240 }}>{description}</p>
      {action}
    </div>
  );
}
