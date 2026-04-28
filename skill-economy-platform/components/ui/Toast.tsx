'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: 'from-emerald-500/90 to-green-600/90 border-emerald-400/30',
    error: 'from-red-500/90 to-rose-600/90 border-red-400/30',
    info: 'from-brand-600/90 to-indigo-600/90 border-brand-400/30',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'bg-gradient-to-r text-white border rounded-xl px-5 py-3 shadow-xl',
        'animate-slide-up flex items-center gap-3 min-w-[280px]',
        colors[type]
      )}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
        {icons[type]}
      </span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="text-white/60 hover:text-white ml-2">×</button>
    </div>
  );
}

// Toast hook
let toastFn: ((msg: string, type?: 'success' | 'error' | 'info') => void) | null = null;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    toastFn = (msg, type = 'info') => setToast({ msg, type });
  }, []);

  return (
    <>
      {children}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  toastFn?.(message, type);
}
