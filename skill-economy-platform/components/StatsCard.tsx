'use client';

import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
  gradient?: string;
}

export function StatsCard({ label, value, change, icon, gradient = 'from-brand-500 to-indigo-600' }: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-4 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className="text-xs text-emerald-400 mt-1">↑ {change}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface RoleSwitcherProps {
  role: 'learner' | 'earner' | 'mentor';
  onSwitch: (role: 'learner' | 'earner' | 'mentor') => void;
}

const roles = [
  { value: 'learner' as const, label: 'Learn', emoji: '📚', color: 'from-blue-500 to-cyan-500' },
  { value: 'earner' as const, label: 'Earn', emoji: '💰', color: 'from-emerald-500 to-green-500' },
  { value: 'mentor' as const, label: 'Mentor', emoji: '🎓', color: 'from-neon-purple to-pink-500' },
];

export function RoleSwitcher({ role, onSwitch }: RoleSwitcherProps) {
  return (
    <div className="glass-card rounded-2xl p-1.5 flex gap-1">
      {roles.map((r) => (
        <button
          key={r.value}
          onClick={() => onSwitch(r.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all ${
            role === r.value
              ? `bg-gradient-to-r ${r.color} shadow-lg`
              : 'hover:bg-white/5 text-gray-400'
          }`}
        >
          <span className="text-sm">{r.emoji}</span>
          <span className="text-xs font-semibold hidden sm:inline">{r.label}</span>
        </button>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4 animate-float">{emoji}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded" />
      <Skeleton className="w-full h-4 rounded" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-4 rounded-full" />
        <Skeleton className="w-20 h-4 rounded-full" />
      </div>
      <div className="flex justify-between pt-2 border-t border-white/5">
        <Skeleton className="w-24 h-4 rounded" />
        <Skeleton className="w-16 h-5 rounded" />
      </div>
    </div>
  );
}
