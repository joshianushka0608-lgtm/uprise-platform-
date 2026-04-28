'use client';

import React, { useState } from 'react';
import { TopNav, Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Placeholder data - integrate with real API
const UPCOMING_SESSIONS = [
  { id: '1', mentor: 'Neha Kapoor', topic: 'PM Interview Prep', date: '2026-04-27', time: '3:00 PM', status: 'upcoming' },
  { id: '2', mentor: 'Ravi Shankar', topic: 'System Design Basics', date: '2026-04-29', time: '11:00 AM', status: 'upcoming' },
];

const PAST_SESSIONS = [
  { id: '3', mentor: 'Neha Kapoor', topic: 'Product Strategy', date: '2026-04-20', time: '4:00 PM', status: 'completed', rating: 5 },
  { id: '4', mentor: 'Ananya Singh', topic: 'Portfolio Review', date: '2026-04-15', time: '2:00 PM', status: 'completed', rating: 5 },
];

export default function MentorshipPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Mentorship" />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* Header */}
        <div className="glass-card rounded-2xl p-5 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-pink-500/20 border border-neon-purple/20 flex items-center justify-center text-3xl">
              🎓
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Your Mentorship Journey</h1>
              <p className="text-sm text-gray-400">Book sessions, track progress, grow skills</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xl font-bold text-white">{UPCOMING_SESSIONS.length}</p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xl font-bold text-white">{PAST_SESSIONS.length}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xl font-bold text-amber-400">5.0★</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <button
            onClick={() => setTab('upcoming')}
            className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', tab === 'upcoming' ? 'bg-brand-500 text-white' : 'text-gray-400')}
          >
            Upcoming ({UPCOMING_SESSIONS.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', tab === 'past' ? 'bg-brand-500 text-white' : 'text-gray-400')}
          >
            Past ({PAST_SESSIONS.length})
          </button>
        </div>

        {/* Sessions */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {tab === 'upcoming' && UPCOMING_SESSIONS.map((session) => (
            <Card key={session.id}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white font-bold">
                  {session.mentor[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{session.mentor}</h3>
                  <p className="text-xs text-gray-400">{session.topic}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info" size="sm">{session.date}</Badge>
                    <Badge variant="default" size="sm">{session.time}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1">Join Session</Button>
                <Button variant="ghost" size="sm">Reschedule</Button>
              </div>
            </Card>
          ))}

          {tab === 'past' && PAST_SESSIONS.map((session) => (
            <Card key={session.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold text-sm">
                    {session.mentor[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{session.mentor}</h3>
                    <p className="text-xs text-gray-400">{session.topic}</p>
                    <p className="text-xs text-gray-500 mt-1">{session.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 text-sm">★ {session.rating}</span>
                  <p className="text-xs text-gray-500 mt-0.5">Completed</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1">Leave Review</Button>
                <Button variant="ghost" size="sm">Book Again</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Find More Mentors */}
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h2 className="font-semibold text-white mb-3">Explore More Mentors</h2>
          <Button variant="secondary" className="w-full">
            🎓 Browse All Mentors
          </Button>
        </div>
      </main>

      <Navbar />
    </div>
  );
}