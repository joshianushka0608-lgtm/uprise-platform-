export const INTEREST_TREE = [
  {
    key: 'mathematics',
    label: 'Mathematics',
    emoji: '📐',
    children: [
      { key: 'math-theory', label: 'Theory & Concepts', emoji: '📖' },
      { key: 'math-problem', label: 'Problem Solving', emoji: '🧮' },
      { key: 'math-teaching', label: 'Teaching', emoji: '👨‍🏫' },
      { key: 'math-exams', label: 'Competitive Exams', emoji: '📋' },
      { key: 'math-homework', label: 'Homework Help', emoji: '✏️' },
    ],
  },
  {
    key: 'science',
    label: 'Science',
    emoji: '🔬',
    children: [
      { key: 'physics', label: 'Physics', emoji: '⚡' },
      { key: 'chemistry', label: 'Chemistry', emoji: '🧪' },
      { key: 'biology', label: 'Biology', emoji: '🧬' },
      { key: 'science-projects', label: 'Science Projects', emoji: '🔭' },
    ],
  },
  {
    key: 'technology',
    label: 'Technology',
    emoji: '💻',
    children: [
      { key: 'ai-ml', label: 'AI & Machine Learning', emoji: '🤖' },
      { key: 'programming', label: 'Programming', emoji: '⌨️' },
      { key: 'web-dev', label: 'Web Development', emoji: '🌐' },
      { key: 'ui-ux', label: 'UI/UX Design', emoji: '🎨' },
      { key: 'data-science', label: 'Data Science', emoji: '📊' },
    ],
  },
  {
    key: 'creative',
    label: 'Creative',
    emoji: '✨',
    children: [
      { key: 'writing', label: 'Writing', emoji: '✍️' },
      { key: 'content-writing', label: 'Content Writing', emoji: '📝' },
      { key: 'logo-design', label: 'Logo Design', emoji: '🖌️' },
      { key: 'video-editing', label: 'Video Editing', emoji: '🎬' },
      { key: 'marketing', label: 'Marketing', emoji: '📈' },
      { key: 'photography', label: 'Photography', emoji: '📷' },
    ],
  },
  {
    key: 'business',
    label: 'Business',
    emoji: '📊',
    children: [
      { key: 'finance', label: 'Finance', emoji: '💹' },
      { key: 'entrepreneurship', label: 'Entrepreneurship', emoji: '🚀' },
      { key: 'economics', label: 'Economics', emoji: '📉' },
      { key: 'business-strategy', label: 'Business Strategy', emoji: '🎯' },
    ],
  },
  {
    key: 'languages',
    label: 'Languages',
    emoji: '🌍',
    children: [
      { key: 'english', label: 'English', emoji: '🇬🇧' },
      { key: 'hindi', label: 'Hindi', emoji: '🇮🇳' },
      { key: 'other-languages', label: 'Other Languages', emoji: '🗣️' },
    ],
  },
];

export function getInterestLabel(key: string): string {
  for (const cat of INTEREST_TREE) {
    if (cat.key === key) return cat.label;
    if (cat.children) {
      for (const sub of cat.children) {
        if (sub.key === key) return `${cat.label} › ${sub.label}`;
      }
    }
  }
  return key;
}

export function getInterestEmoji(key: string): string {
  for (const cat of INTEREST_TREE) {
    if (cat.key === key) return cat.emoji;
    if (cat.children) {
      for (const sub of cat.children) {
        if (sub.key === key) return sub.emoji;
      }
    }
  }
  return '📌';
}

export const GRADE_LEVELS = [
  { value: 'grade-6-8', label: 'Grade 6–8' },
  { value: 'grade-9-10', label: 'Grade 9–10' },
  { value: 'grade-11-12', label: 'Grade 11–12' },
  { value: 'college', label: 'College / University' },
];

export const TASK_CATEGORIES = INTEREST_TREE;
