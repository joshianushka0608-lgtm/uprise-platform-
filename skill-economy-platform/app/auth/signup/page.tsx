'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ROLES = [
  { value: 'learner', label: 'Learner', desc: 'Find mentors & learn skills', emoji: '📚', color: 'from-blue-500 to-cyan-500' },
  { value: 'earner', label: 'Earner', desc: 'Post tasks & earn money', emoji: '💰', color: 'from-emerald-500 to-green-500' },
  { value: 'both', label: 'Both', desc: 'Learn & earn on the same account', emoji: '⚡', color: 'from-brand-500 to-neon-purple' },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [selectedRole, setSelectedRole] = useState('both');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      // Basic email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('Please enter a valid email address.');
        return;
      }
      setError('');
      setStep(2);
      return;
    }

    setError('');
    setLoading(true);

    // Demo mode — no backend needed
    await new Promise((r) => setTimeout(r, 1200));

    if (typeof window !== 'undefined') {
      const role = selectedRole === 'both' ? 'earner' : selectedRole;
      localStorage.setItem('token', `demo-signup-${Date.now()}`);
      localStorage.setItem('demo_role', role);
      localStorage.setItem('demo_email', form.email);
      localStorage.setItem('demo_name', form.name);
    }

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-gray-400 text-sm">
          {step === 1 ? 'Start your skill economy journey' : 'Almost there — choose your role'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-brand-500' : 'bg-white/10'}`} />
        <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-brand-500' : 'bg-white/10'}`} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <Input
              label="Full Name"
              placeholder="Priya Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={<span>👤</span>}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<span>✉️</span>}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<span>🔒</span>}
              required
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400">
              Hi <span className="text-white font-medium">{form.name}</span>! How do you want to use SkillEdge?
            </p>

            <div className="space-y-2">
              {ROLES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRole(opt.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left border ${
                    selectedRole === opt.value
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-xl flex-shrink-0`}>
                    {opt.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                  {selectedRole === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              icon={<span>📱</span>}
            />
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {step === 1 ? 'Continue →' : 'Create Account →'}
        </Button>

        {step === 2 && (
          <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
        )}
      </form>

      <p className="text-center text-xs text-gray-500">
        By signing up, you agree to our{' '}
        <Link href="#" className="text-brand-400">Terms</Link> and{' '}
        <Link href="#" className="text-brand-400">Privacy Policy</Link>
      </p>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
