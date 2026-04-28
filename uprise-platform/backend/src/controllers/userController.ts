import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db, { User, Role } from "../db/index.js";
import { AuthRequest } from "../middleware/auth.js";

export const getMe = (req: AuthRequest, res: Response): void => {
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

    const roles = db
      .prepare("SELECT role_type, active FROM roles WHERE user_id = ?")
      .all(req.userId) as Role[];

    const skills = db
      .prepare("SELECT * FROM user_skills WHERE user_id = ? ORDER BY created_at DESC")
      .all(req.userId);

    // Task counts
    const postedCount = db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE poster_id = ?")
      .get(req.userId) as { count: number };

    const completedCount = db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE accepted_by = ? AND status = 'completed'")
      .get(req.userId) as { count: number };

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        bio: user.bio,
        city: user.city,
        state: user.state,
        student_id: user.student_id,
        student_id_verified: !!user.student_id_verified,
        roles,
        skills,
        stats: {
          tasks_posted: postedCount.count,
          tasks_completed: completedCount.count,
        },
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateMe = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { name, bio, phone, city, state, avatar_url } = req.body;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { updates.push("name = ?"); values.push(name); }
    if (bio !== undefined) { updates.push("bio = ?"); values.push(bio); }
    if (phone !== undefined) { updates.push("phone = ?"); values.push(phone); }
    if (city !== undefined) { updates.push("city = ?"); values.push(city); }
    if (state !== undefined) { updates.push("state = ?"); values.push(state); }
    if (avatar_url !== undefined) { updates.push("avatar_url = ?"); values.push(avatar_url); }

    if (updates.length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    updates.push("updated_at = datetime('now')");
    values.push(req.userId);

    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId) as User;

    res.json({ message: "Profile updated", user: { id: user.id, name: user.name, email: user.email, phone: user.phone, bio: user.bio, city: user.city, avatar_url: user.avatar_url } });
  } catch (err) {
    console.error("UpdateMe error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const toggleRoles = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { roles } = req.body; // array of { role_type: "learner"|"earner"|"mentor", active: boolean }

    if (!Array.isArray(roles)) {
      res.status(400).json({ error: "roles must be an array" });
      return;
    }

    for (const role of roles) {
      const existing = db
        .prepare("SELECT id FROM roles WHERE user_id = ? AND role_type = ?")
        .get(req.userId, role.role_type);

      if (existing) {
        db.prepare(
          "UPDATE roles SET active = ? WHERE user_id = ? AND role_type = ?"
        ).run(role.active ? 1 : 0, req.userId, role.role_type);
      } else {
        db.prepare(`
          INSERT INTO roles (id, user_id, role_type, active)
          VALUES (?, ?, ?, ?)
        `).run(uuidv4(), req.userId, role.role_type, role.active ? 1 : 0);
      }
    }

    const updatedRoles = db
      .prepare("SELECT role_type, active FROM roles WHERE user_id = ?")
      .all(req.userId);

    res.json({ message: "Roles updated", roles: updatedRoles });
  } catch (err) {
    console.error("ToggleRoles error:", err);
    res.status(500).json({ error: "Failed to update roles" });
  }
};

export const updateStudentId = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { student_id } = req.body;

    if (!student_id) {
      res.status(400).json({ error: "student_id is required" });
      return;
    }

    // Phase 1: just store it, verification is manual
    db.prepare(`
      UPDATE users SET student_id = ?, student_id_verified = 0, updated_at = datetime('now')
      WHERE id = ?
    `).run(student_id, req.userId);

    res.json({ message: "Student ID submitted for review", verified: false });
  } catch (err) {
    console.error("UpdateStudentId error:", err);
    res.status(500).json({ error: "Failed to submit student ID" });
  }
};

export const getPublicProfile = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;

    const user = db.prepare(
      "SELECT id, name, avatar_url, bio, city, state, created_at FROM users WHERE id = ?"
    ).get(id) as Partial<User> | undefined;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const roles = db
      .prepare("SELECT role_type FROM roles WHERE user_id = ? AND active = 1")
      .all(id) as { role_type: string }[];

    const skills = db
      .prepare("SELECT skill_name, skill_level, verified FROM user_skills WHERE user_id = ?")
      .all(id);

    const postedCount = db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE poster_id = ?")
      .get(id) as { count: number };

    const completedCount = db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE accepted_by = ? AND status = 'completed'")
      .get(id) as { count: number };

    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
      FROM reviews r
      JOIN users u ON u.id = r.reviewer_id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all(id);

    const avgRating = db
      .prepare("SELECT AVG(rating) as avg FROM reviews WHERE reviewee_id = ?")
      .get(id) as { avg: number | null };

    res.json({
      profile: {
        ...user,
        roles: roles.map((r) => r.role_type),
        skills,
        stats: {
          tasks_posted: postedCount.count,
          tasks_completed: completedCount.count,
          avg_rating: avgRating.avg ? Number(avgRating.avg.toFixed(1)) : null,
          review_count: reviews.length,
        },
        reviews,
      },
    });
  } catch (err) {
    console.error("GetPublicProfile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const addSkill = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { skill_name, skill_level = "beginner" } = req.body;

    if (!skill_name) {
      res.status(400).json({ error: "skill_name is required" });
      return;
    }

    // Check if already exists
    const existing = db
      .prepare("SELECT id FROM user_skills WHERE user_id = ? AND LOWER(skill_name) = LOWER(?)")
      .get(req.userId, skill_name);

    if (existing) {
      res.status(409).json({ error: "Skill already added" });
      return;
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO user_skills (id, user_id, skill_name, skill_level)
      VALUES (?, ?, ?, ?)
    `).run(id, req.userId, skill_name.trim(), skill_level);

    res.status(201).json({ message: "Skill added", skill: { id, skill_name, skill_level } });
  } catch (err) {
    console.error("AddSkill error:", err);
    res.status(500).json({ error: "Failed to add skill" });
  }
};

export const removeSkill = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { skillId } = req.params;
    db.prepare("DELETE FROM user_skills WHERE id = ? AND user_id = ?").run(skillId, req.userId);

    res.json({ message: "Skill removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove skill" });
  }
};
