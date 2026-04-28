'use client';

import { useState } from 'react';
import { Logo } from '@/components/Logo';

const ONBOARD_STEPS = ['intent', 'identity'] as const;
type OnboardStep = typeof ONBOARD_STEPS[number];

const INTENT_OPTIONS = [
  { key: 'earn', emoji: '💰', label: 'Earn Money', desc: 'Complete tasks and get paid' },
  { key: 'post', emoji: '📋', label: 'Get Work Done', desc: 'Post tasks and hire talent' },
  { key: 'learn', emoji: '📚', label: 'Learn & Explore', desc: 'Discover skills and grow' },
];

const IDENTITY_OPTIONS = [
  { key: 'student', emoji: '🎓', label: 'Student', desc: 'Looking to earn or learn' },
  { key: 'mentor', emoji: '🎯', label: 'Mentor', desc: 'Guide and teach others' },
  { key: 'both', emoji: '⚡', label: 'Both', desc: 'Earn, learn, and mentor' },
];

export default function LandingPage() {
  const [step, setStep] = useState<OnboardStep>('intent');
  const [intent, setIntent] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIntent = (key: string) => {
    setIntent(key);
    setStep('identity');
  };

  const handleIdentity = async (key: string) => {
    setIdentity(key);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (typeof window !== 'undefined') {
      localStorage.setItem('uprise_token', 'demo-token');
      localStorage.setItem('uprise_intent', intent || '');
      localStorage.setItem('uprise_identity', key);
      localStorage.setItem('uprise_name', name || 'Guest');
    }
    setLoading(false);
    window.location.href = '/dashboard';
  };

  const progress = step === 'intent' ? 33 : 66;

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#1A1A1D' }}>
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Logo size="md" />
        <a href="/dashboard" className="text-sm font-medium text-orange hover:text-orange-light transition-colors" style={{ color: '#E07A2F' }}>
          Skip →
        </a>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Progress */}
        <div className="w-full max-w-sm mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: '#6B6B73' }}>
              {step === 'intent' ? 'Step 1 of 2' : 'Step 2 of 2'}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#E07A2F' }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step 1: Intent */}
        {step === 'intent' && (
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              What do you want<br />to do on UpRise?
            </h1>
            <p className="text-sm mb-8" style={{ color: '#6B6B73' }}>
              Choose what brings you here today.
            </p>

            <div className="space-y-3">
              {INTENT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleIntent(opt.key)}
                  className="w-full card card-hover p-4 flex items-center gap-4 text-left"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(224,122,47,0.12)', border: '1px solid rgba(224,122,47,0.2)' }}
                  >
                    {opt.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B6B73' }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Identity */}
        {step === 'identity' && (
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              Who are you?
            </h1>
            <p className="text-sm mb-8" style={{ color: '#6B6B73' }}>
              {intent === 'earn' ? 'Start earning by completing tasks.' : intent === 'post' ? 'Post your first task in minutes.' : 'Discover mentors and build skills.'}
            </p>

            <div className="space-y-3">
              {IDENTITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleIdentity(opt.key)}
                  disabled={loading}
                  className="w-full card card-hover p-4 flex items-center gap-4 text-left"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(224,122,47,0.12)', border: '1px solid rgba(224,122,47,0.2)' }}
                  >
                    {opt.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B6B73' }}>{opt.desc}</p>
                  </div>
                  {loading && identity === opt.key && (
                    <svg className="animate-spin h-4 w-4" style={{ color: '#E07A2F' }} viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('intent')}
              className="btn-ghost w-full mt-4 py-2 text-sm"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Bottom note */}
      <div className="fixed bottom-0 left-0 right-0 p-6 text-center">
        <p className="text-xs" style={{ color: '#6B6B73' }}>
          By continuing, you agree to UpRise's Terms & Privacy Policy
        </p>
      </div>
    </main>
  );
}
