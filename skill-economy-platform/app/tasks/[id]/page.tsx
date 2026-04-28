'use client';

import React, { useState } from 'react';
import { TopNav, Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';
import { formatCurrency, daysUntil, CATEGORIES, cn } from '@/lib/utils';

const MOCK_TASK = {
  id: '1',
  title: 'Math notes for Grade 10 — Chapter 1 to 5',
  description: 'I need handwritten notes for CBSE Grade 10 Mathematics, covering Chapters 1-5: Real Numbers, Polynomials, Pair of Linear Equations, Quadratic Equations, and Arithmetic Progressions.\n\nRequirements:\n- Neat handwritten notes (not typed)\n- Each chapter with formulas, examples, and key points\n- Diagrams where applicable\n- PDF format preferred\n\nBudget is flexible for excellent work.',
  category: 'writing',
  delivery_type: 'physical',
  grade_level: 'Grade 10',
  area: 'Andheri West, Mumbai',
  base_budget: 800,
  final_budget: 1000,
  negotiable: true,
  deadline_date: '2026-04-29',
  deadline_time: '6:00 PM',
  complexity: 'medium',
  status: 'open',
  poster: {
    id: 'u1', name: 'Vikram M.', avatar_url: '', bio: 'Grade 10 student, CBSE',
    rating: 4.9, tasks_completed: 3, joined: 'Jan 2026', area: 'Andheri West, Mumbai',
  },
  skills: ['Mathematics', 'Notes', 'CBSE', 'Handwriting'],
  bids: [
    { id: 'b1', bidder: { name: 'Priya S.' }, amount: 750, message: 'I have excellent handwriting and scored 95 in Math. Happy to help!', rating: 4.8, completed: 24 },
    { id: 'b2', bidder: { name: 'Arjun N.' }, amount: 900, message: 'Engineering student. Detailed notes with solved examples and diagrams.', rating: 5.0, completed: 41 },
    { id: 'b3', bidder: { name: 'Sneha K.' }, amount: 600, message: 'Quick turnaround. Budget-friendly option.', rating: 4.6, completed: 18 },
  ],
};

const STATUS_STEPS = ['Pending', 'In Progress', 'Completed', 'Rated'];

export default function TaskDetailPage() {
  const [negotiateModal, setNegotiateModal] = useState(false);
  const [negAmount, setNegAmount] = useState('');
  const [negMessage, setNegMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const task = MOCK_TASK;
  const category = CATEGORIES.find((c) => c.value === task.category);
  const days = daysUntil(task.deadline_date);

  const handleNegotiate = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setNegotiateModal(false);
    showToast('Counter offer sent!', 'success');
  };

  const handleAcceptBid = async (bidderName: string) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    showToast('Bid accepted! Project started.', 'success');
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Project Details" showBack />
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5">

        {/* Header */}
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2 flex-wrap">
            {category && <span className="text-xl">{category.emoji}</span>}
            <Badge variant="info">
              {task.delivery_type === 'physical' ? '📦 Physical' : '🌐 Online'}
            </Badge>
            <Badge variant="warning">{task.complexity}</Badge>
            <Badge variant={days <= 2 ? 'danger' : 'success'}>⏳ {days}d left</Badge>
            {task.negotiable && <Badge variant="warning">💬 Negotiable</Badge>}
          </div>
          <h1 className="text-xl font-bold text-white">{task.title}</h1>
          {task.grade_level && <Badge variant="default">{task.grade_level} • CBSE</Badge>}
        </div>

        {/* Budget */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Budget Range</p>
              <p className="text-2xl font-black text-neon-green">
                {formatCurrency(task.base_budget)} — {formatCurrency(task.final_budget)}
              </p>
              {task.negotiable && <p className="text-xs text-amber-400 mt-1">💬 Open to negotiation</p>}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-neon-purple/20 border border-brand-500/20 flex items-center justify-center text-2xl">💰</div>
          </div>
        </div>

        {/* Delivery & Deadline */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <h2 className="font-semibold text-white mb-3 text-sm">Delivery Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">{task.delivery_type === 'physical' ? '📦' : '🌐'}</span>
              <div>
                <p className="text-xs text-gray-500">Delivery</p>
                <p className="text-sm text-white font-medium">{task.delivery_type === 'physical' ? 'Physical' : 'Online'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-xs text-gray-500">Deadline</p>
                <p className="text-sm text-white font-medium">{task.deadline_date}</p>
              </div>
            </div>
            {task.area && (
              <div className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-white font-medium">{task.area}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-lg">⭐</span>
              <div>
                <p className="text-xs text-gray-500">Poster Rating</p>
                <p className="text-sm text-white font-medium">★ {task.poster.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-card rounded-2xl p-5 animate-slide-up">
          <h2 className="font-semibold text-white mb-3">About this project</h2>
          {task.description.split('\n').map((para, i) => {
            if (!para.trim()) return null;
            const isBullet = para.trimStart().startsWith('-');
            return <p key={i} className={`text-sm ${isBullet ? 'text-gray-300 pl-2' : 'text-gray-300 leading-relaxed'}`}>{para}</p>;
          })}
          <div className="flex flex-wrap gap-2 mt-4">
            {task.skills.map((skill) => (
              <span key={skill} className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">{skill}</span>
            ))}
          </div>
        </div>

        {/* Poster */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <h2 className="font-semibold text-white mb-3 text-sm">About the Poster</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white font-bold">{task.poster.name[0]}</div>
            <div>
              <p className="font-medium text-white">{task.poster.name}</p>
              <p className="text-xs text-gray-500">{task.poster.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span>★ {task.poster.rating} rating</span>
            <span>✅ {task.poster.tasks_completed} tasks</span>
            <span>📍 {task.poster.area}</span>
          </div>
        </div>

        {/* Status tracker */}
        <div className="glass-card rounded-2xl p-4 animate-slide-up">
          <h2 className="font-semibold text-white mb-4 text-sm">Project Status</h2>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-500'
                  )}>{i + 1}</div>
                  <span className={cn('text-xs', i === 0 ? 'text-brand-400 font-medium' : 'text-gray-500')}>{step}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && <div className="flex-1 h-px bg-white/10 mx-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bids / Applications */}
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Applications ({task.bids.length})</h2>
          </div>
          {task.bids.map((bid) => (
            <Card key={bid.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-sm font-bold">{bid.bidder.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{bid.bidder.name}</p>
                    <p className="text-xs text-gray-500">★ {bid.rating} • {bid.completed} projects done</p>
                  </div>
                </div>
                <span className="text-base font-bold text-neon-green">{formatCurrency(bid.amount)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{bid.message}</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleAcceptBid(bid.bidder.name)}>Accept Bid ✓</Button>
                <Button size="sm" variant="secondary" onClick={() => setNegotiateModal(true)}>💬 Counter</Button>
              </div>
            </Card>
          ))}
        </div>

      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 glass border-t border-white/5 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button variant="secondary" onClick={() => setNegotiateModal(true)} className="flex-1">💬 Negotiate</Button>
          <Button className="flex-1" onClick={() => setNegotiateModal(true)}>Submit Application</Button>
        </div>
      </div>

      {/* Negotiate Modal */}
      <Modal isOpen={negotiateModal} onClose={() => setNegotiateModal(false)} title="Negotiate Terms">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Price (₹)</label>
            <input type="number" placeholder={`${task.base_budget} - ${task.final_budget}`} value={negAmount} onChange={(e) => setNegAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 transition-all" />
          </div>
          <Textarea label="Message (optional)" placeholder="Suggest a different price or timeline..." value={negMessage} onChange={(e) => setNegMessage(e.target.value)} className="min-h-[100px]" />
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-gray-300">
            💬 Negotiation is normal on SkillEdge. Both parties must agree before work begins.
          </div>
          <Button onClick={handleNegotiate} loading={submitting} className="w-full">Send Offer ✓</Button>
        </div>
      </Modal>

      <Navbar />
    </div>
  );
}
