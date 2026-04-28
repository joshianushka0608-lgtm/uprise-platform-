'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';

const DEMO_USERS = [
  {
    role: 'Earner',
    emoji: '💰',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    desc: 'Post tasks, hire talent, manage projects',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    role: 'Learner',
    emoji: '📚',
    name: 'Rahul Mehta',
    email: 'rahul@demo.com',
    desc: 'Browse tasks, book mentors, build skills',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    role: 'Mentor',
    emoji: '🎓',
    name: 'Neha Kapoor',
    email: 'neha@demo.com',
    desc: 'Offer sessions, earn, grow your audience',
    gradient: 'from-neon-purple to-pink-500',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, role: string) => {
    setDemoLoading(role);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    // Store a demo token and redirect
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', `demo-token-${role.toLowerCase()}`);
      localStorage.setItem('demo_role', role.toLowerCase());
      localStorage.setItem('demo_email', demoEmail);
    }
    setDemoLoading(null);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm">Sign in to continue to SkillEdge</p>
      </div>

      {/* Demo accounts */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 text-center">Try a demo account — no signup needed</p>
        <div className="grid gap-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.role}
              onClick={() => handleDemoLogin(user.email, user.role)}
              disabled={demoLoading !== null}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group disabled:opacity-50"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
                {user.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{user.role} Demo</p>
                <p className="text-xs text-gray-500 truncate">{user.desc}</p>
              </div>
              {demoLoading === user.role ? (
                <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="text-xs text-brand-400 group-hover:text-brand-300 transition-colors">Enter →</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0a0a0f] px-4 text-gray-500">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
