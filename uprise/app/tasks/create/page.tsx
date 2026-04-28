'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InterestTree } from '@/components/InterestTree';
import { INTEREST_TREE, GRADE_LEVELS } from '@/lib/interests';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const STEPS = ['Details', 'Category', 'Budget & Deadline'];

export default function CreateTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    selectedCategories: [] as string[],
    gradeLevel: '',
    subject: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    negotiable: true,
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.title.trim() && form.description.trim();
    if (step === 1) return form.selectedCategories.length > 0;
    if (step === 2) return form.budgetMin && form.deadline;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Top nav */}
      <header className="top-nav flex items-center gap-4">
        <Link href="/tasks" className="text-white">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-white">Post a Task</h1>
        </div>
        <span className="text-xs" style={{ color: '#6B6B73' }}>{step + 1}/{STEPS.length}</span>
      </header>

      {/* Progress */}
      <div className="px-5 pt-3 max-w-lg mx-auto">
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-colors"
              style={{ background: i <= step ? '#E07A2F' : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#6B6B73' }}>{STEPS[step]}</p>
      </div>

      <main className="px-5 pt-5 max-w-lg mx-auto space-y-5">
        {/* Step 0: Details */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-up">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#A0A0A8' }}>Task Title *</label>
              <input
                className="input-field"
                placeholder="e.g., Grade 10 Math notes for chapters 1–5"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={80}
              />
              <p className="text-xs mt-1 text-right" style={{ color: '#6B6B73' }}>{form.title.length}/80</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#A0A0A8' }}>Description *</label>
              <textarea
                className="input-field"
                placeholder="Describe what you need. Include format, topics, specific requirements, and any examples..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                style={{ minHeight: 120 }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#A0A0A8' }}>Class / Level</label>
              <div className="grid grid-cols-2 gap-2">
                {GRADE_LEVELS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => set('gradeLevel', g.value)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      form.gradeLevel === g.value
                        ? 'border-orange/50 bg-orange/10 text-orange'
                        : 'border-white/6 bg-graphite-light text-secondary hover:border-white/15'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="mb-4">
              <p className="text-xs font-medium mb-1" style={{ color: '#A0A0A8' }}>Select interests that match this task</p>
              <p className="text-xs" style={{ color: '#6B6B73' }}>{form.selectedCategories.length} selected</p>
            </div>
            <InterestTree
              selected={form.selectedCategories}
              onChange={(cats) => set('selectedCategories', cats)}
            />
          </div>
        )}

        {/* Step 2: Budget & Deadline */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#A0A0A8' }}>Your Budget Range (₹) *</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B6B73' }}>Min</p>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 300"
                    value={form.budgetMin}
                    onChange={(e) => set('budgetMin', e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B6B73' }}>Max</p>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 800"
                    value={form.budgetMax}
                    onChange={(e) => set('budgetMax', e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(e) => set('negotiable', e.target.checked)}
                  className="accent-orange"
                  style={{ accentColor: '#E07A2F' }}
                />
                <span className="text-xs" style={{ color: '#A0A0A8' }}>Budget is negotiable</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#A0A0A8' }}>Deadline *</label>
              <input
                type="date"
                className="input-field"
                value={form.deadline}
                onChange={(e) => set('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Summary */}
            <div className="card p-4 space-y-2">
              <p className="text-xs font-semibold" style={{ color: '#A0A0A8' }}>Summary</p>
              <p className="text-sm font-medium text-white">{form.title || '—'}</p>
              <p className="text-xs" style={{ color: '#6B6B73' }}>{form.description.slice(0, 100)}{form.description.length > 100 ? '...' : ''}</p>
              <div className="flex gap-3 pt-2 border-t border-white/6">
                {form.budgetMin && (
                  <span className="text-sm font-bold" style={{ color: '#E07A2F' }}>₹{form.budgetMin}{form.budgetMax ? `–${form.budgetMax}` : ''}</span>
                )}
                {form.deadline && (
                  <span className="text-xs" style={{ color: '#6B6B73' }}>Due: {form.deadline}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="btn-outline flex-1 py-3 text-sm">
              ← Back
            </button>
          ) : (
            <Link href="/tasks" className="btn-outline flex-1 py-3 text-sm text-center">
              Cancel
            </Link>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="btn-orange flex-1 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext() || loading}
              className="btn-orange flex-1 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Post Task →'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
