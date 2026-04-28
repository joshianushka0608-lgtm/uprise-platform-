'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { TopNav, Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CATEGORIES, COMPLEXITY_LEVELS, cn, formatCurrency } from '@/lib/utils';
import { showToast } from '@/components/ui/Toast';

const DELIVERY_TYPES = [
  { value: 'online', label: 'Online', emoji: '🌐', desc: 'File upload / digital submission' },
  { value: 'physical', label: 'Physical', emoji: '📦', desc: 'Notebook / document delivery' },
];

const GRADE_LEVELS = [
  { value: 'grade-3-5', label: 'Grade 3–5' },
  { value: 'grade-6-8', label: 'Grade 6–8' },
  { value: 'grade-9-10', label: 'Grade 9–10' },
  { value: 'grade-11-12', label: 'Grade 11–12' },
  { value: 'college', label: 'College' },
];

export default function CreateTaskPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    delivery_type: 'online' as 'online' | 'physical',
    grade_level: '',
    complexity: 'medium',
    effort_hours: 5,
    deadline_date: '',
    deadline_time: '',
    budget_min: '',
    budget_max: '',
    negotiable: true,
    geo_area: '',
    skills: [] as string[],
    instructions: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const estimatedMin = () => {
    const complexity = COMPLEXITY_LEVELS.find((c) => c.value === form.complexity);
    return form.effort_hours * 250 * (complexity?.multiplier || 1);
  };

  const estimatedMax = () => {
    const complexity = COMPLEXITY_LEVELS.find((c) => c.value === form.complexity);
    return form.effort_hours * 400 * (complexity?.multiplier || 1);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.deadline_date || !form.budget_min) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    showToast('Project posted successfully!', 'success');
    window.location.href = '/tasks';
  };

  const canProceed = () => {
    if (step === 1) return form.title && form.description && form.category;
    if (step === 2) return form.deadline_date;
    return true;
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNav title="Post a Project" showBack />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-colors',
                step >= s ? 'bg-brand-500' : 'bg-white/10'
              )}
            />
          ))}
        </div>

        <div className="text-sm text-gray-400">
          Step {step} of 3 — {
            step === 1 ? 'What do you need?' :
            step === 2 ? 'Timeline & Delivery' :
            'Review & Post'
          }
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <Input
              label="Project Title"
              placeholder="e.g., Math assignment notes for Grade 10"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <Textarea
              label="Description"
              placeholder="Describe what you need in detail. Include format, style, topics covered, any specific requirements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[120px]"
            />

            <Select
              label="Category / Subject"
              options={CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <Select
              label="Grade / Education Level"
              options={GRADE_LEVELS}
              value={form.grade_level}
              onChange={(e) => setForm({ ...form, grade_level: e.target.value })}
            />

            {/* Delivery Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Delivery Type</label>
              <div className="grid grid-cols-2 gap-3">
                {DELIVERY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setForm({ ...form, delivery_type: type.value as 'online' | 'physical' })}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      form.delivery_type === type.value
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <p className="text-sm font-semibold text-white">{type.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* File upload (online) */}
            {form.delivery_type === 'online' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Upload Files / Instructions (optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-500/30 transition-colors"
                >
                  <div className="text-2xl mb-2">📎</div>
                  <p className="text-sm text-gray-400">Click to upload files</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, images, documents accepted</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <div className="space-y-1">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-300 truncate flex-1">{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-red-400 text-xs ml-2">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Geo area (physical) */}
            {form.delivery_type === 'physical' && (
              <Input
                label="Your Location / Area"
                placeholder="e.g., Andheri West, Mumbai"
                value={form.geo_area}
                onChange={(e) => setForm({ ...form, geo_area: e.target.value })}
                icon={<span>📍</span>}
              />
            )}

            {/* Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Required Skills (optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput.trim()); }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 transition-all"
                />
                <Button variant="outline" size="md" onClick={() => addSkill(skillInput.trim())}>Add</Button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <Badge key={skill} variant="gradient">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-400">×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={() => canProceed() && setStep(2)} className="w-full">
              Next →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Deadline Date"
                type="date"
                value={form.deadline_date}
                onChange={(e) => setForm({ ...form, deadline_date: e.target.value })}
              />
              <Input
                label="Deadline Time"
                type="time"
                value={form.deadline_time}
                onChange={(e) => setForm({ ...form, deadline_time: e.target.value })}
              />
            </div>

            {/* Complexity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Complexity</label>
              <div className="grid grid-cols-3 gap-2">
                {COMPLEXITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setForm({ ...form, complexity: level.value })}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all',
                      form.complexity === level.value
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <p className="text-sm font-medium text-white">{level.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Effort */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Estimated Effort: <span className="text-brand-400">{form.effort_hours} hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={40}
                value={form.effort_hours}
                onChange={(e) => setForm({ ...form, effort_hours: Number(e.target.value) })}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 hr</span>
                <span>40 hrs</span>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Budget Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={form.budget_min}
                    onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={form.budget_max}
                    onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:border-brand-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={form.negotiable}
                  onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                  className="accent-brand-500"
                />
                <label htmlFor="negotiable" className="text-sm text-gray-400">Budget is negotiable</label>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Suggested range</p>
                <p className="text-sm font-semibold text-brand-400">
                  {formatCurrency(estimatedMin())} — {formatCurrency(estimatedMax())}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Preview →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <Card className="space-y-3">
              <div className="flex items-center gap-2">
                {CATEGORIES.find((c) => c.value === form.category) && (
                  <span className="text-xl">{CATEGORIES.find((c) => c.value === form.category)?.emoji}</span>
                )}
                <Badge variant={form.delivery_type === 'physical' ? 'info' : 'default'}>
                  {form.delivery_type === 'online' ? '🌐 Online' : '📦 Physical'}
                </Badge>
                {form.grade_level && (
                  <Badge variant="default">{GRADE_LEVELS.find((g) => g.value === form.grade_level)?.label}</Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{form.title || '—'}</h3>
              <p className="text-sm text-gray-400">{form.description || '—'}</p>

              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">{s}</span>
                  ))}
                </div>
              )}

              {form.geo_area && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>📍</span> {form.geo_area}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>📅 {form.deadline_date}{form.deadline_time ? ` at ${form.deadline_time}` : ''}</span>
                  <span>⏱ {form.effort_hours}h</span>
                  {form.negotiable && <Badge variant="warning" size="sm">Negotiable</Badge>}
                </div>
                <span className="text-xl font-bold text-neon-green">
                  {form.budget_min ? `${formatCurrency(Number(form.budget_min))}${form.budget_max ? ` — ${formatCurrency(Number(form.budget_max))}` : ''}` : '—'}
                </span>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg">💳</div>
                <div>
                  <p className="text-sm font-medium text-white">Secure Payment</p>
                  <p className="text-xs text-gray-400">Payment is held until you approve the work</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg">📅</div>
                <div>
                  <p className="text-sm font-medium text-white">Deadline Tracking</p>
                  <p className="text-xs text-gray-400">Calendar integration with reminders</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">← Edit</Button>
              <Button onClick={handleSubmit} loading={loading} className="flex-1">
                Post Project 🚀
              </Button>
            </div>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}
