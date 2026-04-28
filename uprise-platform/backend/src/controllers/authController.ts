import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db, { User, Role } from "../db/index.js";
import { AuthRequest } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function generateTokens(userId: string, email: string) {
  const jti = uuidv4();
  const accessToken = jwt.sign(
    { userId, email, jti },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { accessToken, jti };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, phone, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(userId, email.toLowerCase(), password_hash, name, phone || null);

    // Default role: learner
    const roleId = uuidv4();
    db.prepare(`
      INSERT INTO roles (id, user_id, role_type, active)
      VALUES (?, ?, 'learner', 1)
    `).run(roleId, userId);

    // Generate tokens
    const { accessToken, jti } = generateTokens(userId, email);

    res.status(201).json({
      message: "Registration successful",
      token: accessToken,
      user: {
        id: userId,
        name,
        email: email.toLowerCase(),
        phone,
        roles: ["learner"],
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ? AND is_active = 1")
      .get(email.toLowerCase()) as User | undefined;

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Get active roles
    const roles = db
      .prepare("SELECT role_type FROM roles WHERE user_id = ? AND active = 1")
      .all(user.id) as { role_type: string }[];

    // Generate tokens
    const { accessToken } = generateTokens(user.id, user.email);

    res.json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        bio: user.bio,
        city: user.city,
        roles: roles.map((r) => r.role_type),
        student_id_verified: !!user.student_id_verified,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const jti = token.split(".")[2];
      db.prepare(
        "INSERT OR IGNORE INTO jwt_blocklist (id, token_jti) VALUES (?, ?)"
      ).run(uuidv4(), jti);
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId) as User;
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { accessToken } = generateTokens(user.id, user.email);
    res.json({ token: accessToken });
  } catch (err) {
    res.status(500).json({ error: "Token refresh failed" });
  }
};
