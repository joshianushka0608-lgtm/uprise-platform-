'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea, Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import { formatCurrency, cn } from '@/lib/utils';

const MOCK_MENTOR = {
  id: 'm1',
  user: { id: 'm1', name: 'Neha Kapoor', avatar_url: '', bio: '5+ years in product management at Razorpay. Previously led growth at Swiggy. I am passionate about helping students break into product management and build real skills. I have mentored 124 students and helped 40+ land their first PM role.' },
  headline: 'Senior Product Manager @ Razorpay',
  company: 'Razorpay',
  years_exp: 5,
  skills: ['Product Management', 'Strategy', 'User Research', 'A/B Testing', 'Analytics', 'Growth'],
  session_price: 1500,
  free_slots: [
    { day: 'Mon', times: ['10:00 AM', '3:00 PM'] },
    { day: 'Wed', times: ['11:00 AM', '2:00 PM', '5:00 PM'] },
    { day: 'Fri', times: ['9:00 AM', '4:00 PM'] },
  ],
  total_sessions: 124,
  total_minutes: 3720,
  avg_rating: 4.9,
  verified: true,
  badges: [
    { name: 'Mentored 100+', emoji: '🎓' },
    { name: 'Top Rated', emoji: '⭐' },
    { name: 'Verified', emoji: '✓' },
  ],
  reviews: [
    { name: 'Priya S.', rating: 5, text: 'Neha changed my entire approach to PM interviews. Her mock interviews were incredibly valuable.', date: '2026-04-15' },
    { name: 'Rahul M.', rating: 5, text: 'Incredibly insightful session. She helped me structure my thoughts for product design questions.', date: '2026-04-10' },
    { name: 'Sneha K.', rating: 5, text: 'Very practical advice. I landed a PM role at a startup 2 weeks after our session.', date: '2026-03-28' },
  ],
};

export default function MentorDetailPage({ params }: { params: { id: string } }) {
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const mentor = MOCK_MENTOR;

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime) {
      showToast('Please select a time slot', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setBookingModal(false);
    showToast('Session booked! Check your email for details.', 'success');
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Mentor Profile" showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* Profile Hero */}
        <div className="glass-card rounded-2xl p-5 text-center animate-slide-up">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white text-2xl font-bold mx-auto">
              {mentor.user.name[0]}
            </div>
            {mentor.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center text-xs text-black font-bold">
                ✓
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-white">{mentor.user.name}</h1>
          <p className="text-sm text-brand-400 font-medium">{mentor.headline}</p>

          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-400">
            <span>★ {mentor.avg_rating}</span>
            <span>•</span>
            <span>{mentor.total_sessions} sessions</span>
            <span>•</span>
            <span>{mentor.years_exp}y experience</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {mentor.badges.map((b) => (
              <span key={b.name} className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                {b.emoji} {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <h2 className="font-semibold text-white mb-2">About</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{mentor.user.bio}</p>
        </Card>

        {/* Skills */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-white mb-3">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {mentor.skills.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 font-medium">
                {s}
              </span>
            ))}
          </div>
        </Card>

        {/* Availability */}
        <Card className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h2 className="font-semibold text-white mb-3">Available Slots</h2>
          <div className="space-y-2">
            {mentor.free_slots.map((slot) => (
              <div key={slot.day} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">{slot.day}</span>
                <div className="flex gap-1.5 flex-1 flex-wrap">
                  {slot.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => { setSelectedDay(slot.day); setSelectedTime(time); setBookingModal(true); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand-500/20 hover:text-brand-400 transition-all border border-white/5"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-semibold text-white">Reviews ({mentor.reviews.length})</h2>
          {mentor.reviews.map((review, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">
                    {review.name[0]}
                  </div>
                  <span className="text-sm font-medium text-white">{review.name}</span>
                </div>
                <span className="text-xs text-amber-400">★ {review.rating}</span>
              </div>
              <p className="text-sm text-gray-300">{review.text}</p>
              <p className="text-xs text-gray-500 mt-1">{review.date}</p>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 glass border-t border-white/5 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Per session</p>
            <p className="text-2xl font-bold text-neon-green">{formatCurrency(mentor.session_price)}</p>
          </div>
          <Button onClick={() => setBookingModal(true)}>
            Book Session 🚀
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModal} onClose={() => setBookingModal(false)} title="Book a Session">
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center text-white font-bold text-sm">
              {mentor.user.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{mentor.user.name}</p>
              <p className="text-xs text-gray-400">{selectedDay} at {selectedTime} • {formatCurrency(mentor.session_price)}</p>
            </div>
          </div>

          <Textarea
            label="What do you want to discuss?"
            placeholder="Share your goals, questions, or topics for this session..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
            <span>🔒</span>
            <p className="text-xs text-gray-300">Payment is held in escrow and released after the session</p>
          </div>

          <Button onClick={handleBooking} loading={loading} className="w-full">
            Confirm Booking ✓
          </Button>
        </div>
      </Modal>

      <Navbar />
    </div>
  );
}