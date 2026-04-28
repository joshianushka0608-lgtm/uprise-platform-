import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
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

let dbInstance: SqlJsDatabase;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function saveDb() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const data = dbInstance.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    } catch (err) {
      console.error("Failed to save DB:", err);
    }
  }, 500);
}

// Substitute ? placeholders with quoted values (basic SQLite escaping)
function substituteParams(sql: string, params: unknown[]): string {
  let idx = 0;
  return sql.replace(/\?/g, () => {
    const p = params[idx++];
    if (p === null || p === undefined) return "NULL";
    if (typeof p === "number") return String(p);
    if (typeof p === "boolean") return p ? "1" : "0";
    return `'${String(p).replace(/'/g, "''")}'`;
  });
}

function queryAll(sql: string, params: unknown[]): unknown[] {
  const finalSql = substituteParams(sql, params);
  try {
    const result = dbInstance.exec(finalSql);
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  } catch (err) {
    console.error("DB query error:", err, finalSql);
    return [];
  }
}

function queryGet(sql: string, params: unknown[]): unknown {
  const results = queryAll(sql, params);
  return results[0] ?? undefined;
}

function queryRun(sql: string, params: unknown[]): { changes: number; lastInsertRowid: number } {
  const finalSql = substituteParams(sql, params);
  try {
    dbInstance.run(finalSql);
    saveDb();
    return { changes: dbInstance.getRowsModified(), lastInsertRowid: 0 };
  } catch (err) {
    console.error("DB run error:", err, finalSql);
    throw err;
  }
}

// Wrapper that mimics better-sqlite3's prepare()
function prepare(sql: string) {
  return {
    all: (...params: unknown[]) => queryAll(sql, params),
    get: (...params: unknown[]) => queryGet(sql, params),
    run: (...params: unknown[]) => queryRun(sql, params),
  };
}

// Export a default object that mimics the better-sqlite3 db interface
const db = {
  prepare,
  exec(sql: string) {
    try {
      dbInstance.exec(sql);
      saveDb();
    } catch (err) {
      console.error("DB exec error:", err, sql);
      throw err;
    }
  },
};

let initPromise: Promise<void> | null = null;

export async function initDatabase(): Promise<void> {
  if (initPromise) return;
  initPromise = (async () => {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      dbInstance = new SQL.Database(fs.readFileSync(DB_PATH));
    } else {
      dbInstance = new SQL.Database();
    }
    dbInstance.exec("PRAGMA foreign_keys = ON;");
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    dbInstance.exec(schema);
  })();
  return initPromise;
}

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
