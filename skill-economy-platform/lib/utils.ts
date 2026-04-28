import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function daysUntil(dateString: string): number {
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getUrgencyLevel(deadline: string): 'low' | 'medium' | 'high' | 'critical' {
  const days = daysUntil(deadline);
  if (days <= 1) return 'critical';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: 'status-open',
    'in-progress': 'status-inprogress',
    completed: 'status-completed',
    urgent: 'status-urgent',
  };
  return colors[status] || 'bg-gray-700 text-gray-300';
}

export const CATEGORIES = [
  { value: 'design', label: 'Design', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
  { value: 'development', label: 'Development', emoji: '💻', color: 'from-blue-500 to-cyan-500' },
  { value: 'writing', label: 'Writing', emoji: '✍️', color: 'from-amber-500 to-orange-500' },
  { value: 'marketing', label: 'Marketing', emoji: '📈', color: 'from-green-500 to-emerald-500' },
  { value: 'video', label: 'Video & Photo', emoji: '🎬', color: 'from-purple-500 to-violet-500' },
  { value: 'data', label: 'Data & Research', emoji: '📊', color: 'from-indigo-500 to-blue-500' },
  { value: 'music', label: 'Music & Audio', emoji: '🎵', color: 'from-red-500 to-pink-500' },
  { value: 'other', label: 'Other', emoji: '✨', color: 'from-gray-500 to-slate-500' },
];

export const SKILLS_SUGGESTIONS = [
  'React', 'Next.js', 'Node.js', 'Python', 'Machine Learning', 'Figma',
  'UI/UX Design', 'Content Writing', 'SEO', 'Social Media', 'Video Editing',
  'Graphic Design', 'Data Analysis', 'Excel', 'Power BI', 'Canva',
  'Copywriting', 'Email Marketing', 'WordPress', 'Shopify', 'Flutter',
  'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'Docker', 'AWS',
  'English Speaking', 'Public Speaking', 'Tutoring', 'Career Coaching',
];

export const COMPLEXITY_LEVELS = [
  { value: 'low', label: 'Simple', description: 'Quick task, minimal skill required', multiplier: 1.0 },
  { value: 'medium', label: 'Moderate', description: 'Some expertise needed', multiplier: 1.5 },
  { value: 'high', label: 'Complex', description: 'Advanced skills & time required', multiplier: 2.0 },
];
