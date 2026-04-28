'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency, daysUntil, getUrgencyLevel, CATEGORIES } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  base_budget: number;
  final_budget: number;
  deadline: string;
  complexity: 'low' | 'medium' | 'high';
  status: string;
  delivery_type?: 'online' | 'physical' | 'both';
  poster: {
    id: string;
    name: string;
    avatar_url?: string;
    rating?: number;
    area?: string;
  };
  bids_count?: number;
  skills?: string[];
}

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const category = CATEGORIES.find((c) => c.value === task.category);
  const urgency = getUrgencyLevel(task.deadline);
  const days = daysUntil(task.deadline);

  const deliveryLabel = {
    online: '🌐 Online',
    physical: '📦 Physical',
    both: '🔄 Both',
  };

  const urgencyBadge = {
    low: null,
    medium: <Badge variant="warning" size="sm">⏳ {days}d left</Badge>,
    high: <Badge variant="danger" size="sm">🔥 {days}d left</Badge>,
    critical: <Badge variant="danger" size="sm">⚡ {days}d</Badge>,
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card hover className={cn('space-y-3', className)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="text-lg">{category.emoji}</span>
            )}
            <Badge
              variant={
                (task.complexity as string) === 'high'
                  ? 'danger'
                  : (task.complexity as string) === 'medium'
                  ? 'warning'
                  : 'default'
              }
              size="sm"
            >
              {task.complexity}
            </Badge>
            {task.delivery_type && (
              <Badge variant="info" size="sm">
                {deliveryLabel[task.delivery_type]}
              </Badge>
            )}
          </div>
          {urgencyBadge[urgency]}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-white text-base leading-tight line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* Location */}
        {task.poster.area && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>📍</span>
            <span>{task.poster.area}</span>
          </div>
        )}

        {/* Skills */}
        {task.skills && task.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {skill}
              </span>
            ))}
            {task.skills.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                +{task.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">
                {task.poster.name[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-gray-400">{task.poster.name}</span>
            {task.poster.rating && (
              <span className="text-xs text-amber-400 ml-1">★ {task.poster.rating}</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-base font-bold text-neon-green">
              {formatCurrency(task.base_budget)}
              {task.final_budget !== task.base_budget && (
                <span className="text-gray-500 text-xs"> — {formatCurrency(task.final_budget)}</span>
              )}
            </span>
            {task.bids_count !== undefined && task.bids_count > 0 && (
              <span className="text-xs text-gray-500 ml-2">
                {task.bids_count} bid{task.bids_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
