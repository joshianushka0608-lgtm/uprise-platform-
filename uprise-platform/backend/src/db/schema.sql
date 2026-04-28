-- ============================================
-- UpRise Database Schema
-- SQLite (MVP)
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  student_id TEXT,
  student_id_verified INTEGER DEFAULT 0,
  otp_code TEXT,
  otp_expires_at TEXT,
  city TEXT,
  state TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Roles table (learner, earner, mentor)
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_type TEXT NOT NULL CHECK(role_type IN ('learner', 'earner', 'mentor')),
  active INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, role_type)
);

-- User skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_level TEXT DEFAULT 'beginner' CHECK(skill_level IN ('beginner', 'intermediate', 'advanced')),
  verified INTEGER DEFAULT 0,
  source_task_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table (for refresh tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- JWT blocklist (for logout)
CREATE TABLE IF NOT EXISTS jwt_blocklist (
  id TEXT PRIMARY KEY,
  token_jti TEXT UNIQUE NOT NULL,
  revoked_at TEXT DEFAULT (datetime('now'))
);

-- Categories table (seeded)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_roles_user_id ON roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  poster_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  deadline TEXT,
  base_budget REAL DEFAULT 0,
  final_budget REAL,
  complexity TEXT DEFAULT 'medium' CHECK (complexity IN ('low', 'medium', 'high')),
  effort_hours INTEGER DEFAULT 2,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'submitted', 'completed', 'cancelled', 'disputed')),
  accepted_by TEXT,
  submission_url TEXT,
  reviewed_at TEXT,
  rating REAL,
  review_text TEXT,
  delivery_type TEXT DEFAULT 'online' CHECK (delivery_type IN ('online', 'physical')),
  location_city TEXT,
  location_radius INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (poster_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Task applications
CREATE TABLE IF NOT EXISTS task_applications (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  applicant_id TEXT NOT NULL,
  message TEXT,
  proposed_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(task_id, applicant_id)
);

-- Mentor profiles
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  headline TEXT,
  industry TEXT,
  years_exp INTEGER DEFAULT 0,
  skills_json TEXT DEFAULT '[]',
  bio TEXT,
  session_price REAL DEFAULT 200,
  free_sessions INTEGER DEFAULT 0,
  mode TEXT DEFAULT 'online',
  free_slots_json TEXT DEFAULT '[]',
  is_open INTEGER DEFAULT 1,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  avg_rating REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentorship sessions
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL,
  learner_id TEXT NOT NULL,
  topic TEXT,
  mode TEXT DEFAULT 'online',
  duration_minutes INTEGER DEFAULT 30,
  scheduled_at TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  learner_rating REAL,
  learner_feedback TEXT,
  mentor_rating REAL,
  mentor_feedback TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  reviewer_id TEXT NOT NULL,
  reviewee_id TEXT NOT NULL,
  rating REAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_poster ON tasks(poster_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_applications_task ON task_applications(task_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
