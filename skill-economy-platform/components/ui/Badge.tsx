'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gradient';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-gray-300 border-white/10',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gradient: 'bg-gradient-to-r from-brand-500/20 to-neon-purple/20 text-brand-300 border-brand-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface SkillBadgeProps {
  skill: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  onRemove?: () => void;
  className?: string;
}

export function SkillBadge({ skill, level, onRemove, className }: SkillBadgeProps) {
  const levelColors = {
    beginner: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300',
    intermediate: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
    expert: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
  };

  return (
    <span
      className={cn(
        'skill-badge gap-1.5',
        level && `bg-gradient-to-r ${levelColors[level]}`,
        className
      )}
    >
      {skill}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 hover:text-red-400 transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}
