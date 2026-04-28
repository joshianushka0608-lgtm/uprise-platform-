import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../../../data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "uprise.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Run schema
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
db.exec(schema);

export default db;

// Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  student_id: string | null;
  student_id_verified: number;
  otp_code: string | null;
  otp_expires_at: string | null;
  city: string | null;
  state: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  user_id: string;
  role_type: "learner" | "earner" | "mentor";
  active: number;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_level: "beginner" | "intermediate" | "advanced";
  verified: number;
  source_task_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}
