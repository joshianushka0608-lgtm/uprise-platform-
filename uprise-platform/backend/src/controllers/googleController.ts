import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db, { User } from "../db/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function generateToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { google_id, email, name, avatar_url } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // Check if user exists by email
    let user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase()) as User | undefined;

    let isNew = false;

    if (!user) {
      // Create new user via Google
      const userId = uuidv4();
      const randomPassword = uuidv4(); // Placeholder, user won't login with password
      const password_hash = await bcrypt.hash(randomPassword, 10);

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, avatar_url, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `).run(userId, email.toLowerCase(), password_hash, name || email.split("@")[0], avatar_url || null);

      // Default role: learner
      db.prepare(`
        INSERT INTO roles (id, user_id, role_type, active)
        VALUES (?, ?, 'learner', 1)
      `).run(uuidv4(), userId);

      user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as User;
      isNew = true;
    }

    // Generate JWT
    const token = generateToken(user.id, user.email);

    // Get active roles
    const roles = db
      .prepare("SELECT role_type FROM roles WHERE user_id = ? AND active = 1")
      .all(user.id) as { role_type: string }[];

    res.json({
      message: isNew ? "Account created with Google" : "Login with Google successful",
      token,
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
    console.error("Google auth error:", err);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
