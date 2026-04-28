'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Mentor {
  id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
    bio?: string;
  };
  headline?: string;
  company?: string;
  skills: string[];
  session_price: number;
  avg_rating: number;
  total_sessions: number;
  verified?: boolean;
}

interface MentorCardProps {
  mentor: Mentor;
  className?: string;
}

export function MentorCard({ mentor, className }: MentorCardProps) {
  return (
    <Link href={`/mentors/${mentor.id}`}>
      <Card hover className={cn('space-y-3', className)}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {mentor.user.avatar_url ? (
              <img
                src={mentor.user.avatar_url}
                alt={mentor.user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {mentor.user.name[0]?.toUpperCase()}
                </span>
              </div>
            )}
            {mentor.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neon-green flex items-center justify-center text-[8px]">
                ✓
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-white text-sm truncate">
                {mentor.user.name}
              </h3>
            </div>
            {mentor.headline && (
              <p className="text-xs text-gray-400 truncate">
                {mentor.headline}
                {mentor.company && ` @ ${mentor.company}`}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-sm text-white font-medium">{mentor.avg_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({mentor.total_sessions})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">🎓</span>
            <span className="text-xs text-gray-400">{mentor.total_sessions} sessions</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {mentor.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
              +{mentor.skills.length - 4}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-500">Per session</span>
          <span className="text-base font-bold text-neon-green">
            ₹{mentor.session_price.toLocaleString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}
