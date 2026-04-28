'use client';

import { useState } from 'react';
import { INTEREST_TREE } from '@/lib/interests';

interface InterestTreeProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

export function InterestTree({ selected, onChange }: InterestTreeProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  const isSelected = (key: string) => selected.includes(key);

  return (
    <div className="space-y-3">
      {INTEREST_TREE.map((category) => (
        <div key={category.key} className="space-y-2">
          {/* Category */}
          <button
            onClick={() => toggle(category.key)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              isSelected(category.key) && category.children?.every((c) => isSelected(c.key))
                ? 'bg-orange/10 border-orange/40 text-orange'
                : 'bg-graphite-light border-white/6 text-white hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{category.emoji}</span>
              <span className="font-semibold text-sm">{category.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {isSelected(category.key) && category.children?.every((c) => isSelected(c.key)) ? (
                <span className="text-xs text-orange">Selected</span>
              ) : (
                <span className="text-xs text-muted">{category.children?.length || 0} sub</span>
              )}
            </div>
          </button>

          {/* Subcategories */}
          {category.children && (
            <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {category.children.map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => toggle(sub.key)}
                  className={`cat-chip text-left text-xs ${
                    isSelected(sub.key) ? 'selected' : ''
                  }`}
                >
                  <span>{sub.emoji}</span>
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
