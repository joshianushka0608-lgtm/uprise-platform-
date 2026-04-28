import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { AuthRequest } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";

const router = Router();

// Browse mentors
router.get("/", (req, res) => {
  try {
    const { skill, industry, min_price, max_price } = req.query;

    let query = "SELECT * FROM mentor_profiles WHERE is_open = 1";
    const params: unknown[] = [];

    if (min_price) { query += " AND session_price >= ?"; params.push(Number(min_price)); }
    if (max_price) { query += " AND session_price <= ?"; params.push(Number(max_price)); }

    query += " ORDER BY avg_rating DESC, total_sessions DESC LIMIT 50";

    const mentors = db.prepare(query).all(...params);

    // Get user info for each mentor
    const enriched = mentors.map((mentor: Record<string, unknown>) => {
      const user = db.prepare(
        "SELECT id, name, avatar_url, city FROM users WHERE id = ?"
      ).get(mentor.user_id as string) as Record<string, unknown> | undefined;

      let skills: string[] = [];
      try { skills = JSON.parse(mentor.skills_json as string || "[]"); } catch {}

      return { ...mentor, skills, user };
    });

    res.json({ mentors: enriched });
  } catch (err) {
    console.error("Get mentors error:", err);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

// Create/update mentor profile
router.post(
  "/profile",
  authenticate,
  validate([
    body("headline").trim().notEmpty().withMessage("Headline is required"),
    body("industry").trim().notEmpty().withMessage("Industry is required"),
  ]),
  (req: AuthRequest, res: Response) => {
    try {
      const {
        headline, industry, years_exp, skills_json, session_price,
        free_sessions, bio, mode, free_slots_json,
      } = req.body;

      const existing = db.prepare("SELECT id FROM mentor_profiles WHERE user_id = ?").get(req.userId);

      if (existing) {
        db.prepare(`
          UPDATE mentor_profiles SET
            headline = ?, industry = ?, years_exp = ?, skills_json = ?,
            session_price = ?, free_sessions = ?, bio = ?, mode = ?,
            free_slots_json = ?, updated_at = datetime('now')
          WHERE user_id = ?
        `).run(headline, industry, years_exp || 0, JSON.stringify(skills_json || []),
          session_price || 200, free_sessions || 0, bio || "", mode || "online",
          JSON.stringify(free_slots_json || []), req.userId);
        res.json({ message: "Mentor profile updated" });
      } else {
        const id = uuidv4();
        db.prepare(`
          INSERT INTO mentor_profiles (id, user_id, headline, industry, years_exp, skills_json, session_price, free_sessions, bio, mode, free_slots_json, is_open, total_sessions, total_minutes, avg_rating)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0)
        `).run(id, req.userId, headline, industry, years_exp || 0, JSON.stringify(skills_json || []),
          session_price || 200, free_sessions || 0, bio || "", mode || "online",
          JSON.stringify(free_slots_json || []));
        res.status(201).json({ message: "Mentor profile created" });
      }

      // Ensure mentor role is active
      const role = db.prepare("SELECT id FROM roles WHERE user_id = ? AND role_type = 'mentor'").get(req.userId);
      if (role) {
        db.prepare("UPDATE roles SET active = 1 WHERE user_id = ? AND role_type = 'mentor'").run(req.userId);
      } else {
        db.prepare("INSERT INTO roles (id, user_id, role_type, active) VALUES (?, ?, 'mentor', 1)")
          .run(uuidv4(), req.userId);
      }
    } catch (err) {
      console.error("Mentor profile error:", err);
      res.status(500).json({ error: "Failed to save mentor profile" });
    }
  }
);

// Get my mentor profile
router.get("/profile/me", authenticate, (req: AuthRequest, res: Response) => {
  try {
    const profile = db.prepare("SELECT * FROM mentor_profiles WHERE user_id = ?").get(req.userId);
    if (!profile) { res.status(404).json({ error: "Mentor profile not found" }); return; }
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Request mentorship session
router.post("/:id/request", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { topic, mode, scheduled_at } = req.body;

    const mentor = db.prepare("SELECT * FROM mentor_profiles WHERE id = ?").get(id);
    if (!mentor) { res.status(404).json({ error: "Mentor not found" }); return; }
    if ((mentor as Record<string, unknown>).user_id === req.userId) {
      res.status(400).json({ error: "Cannot mentor yourself" }); return;
    }

    const sessionId = uuidv4();
    db.prepare(`
      INSERT INTO mentorship_sessions (id, mentor_id, learner_id, topic, mode, scheduled_at, status)
      VALUES (?, ?, ?, ?, ?, ?, 'requested')
    `).run(sessionId, id, req.userId, topic || "", mode || "online", scheduled_at || null);

    res.status(201).json({ message: "Mentorship requested", session_id: sessionId });
  } catch (err) {
    console.error("Mentorship request error:", err);
    res.status(500).json({ error: "Failed to request mentorship" });
  }
});

// Get my sessions (as learner or mentor)
router.get("/sessions/me", authenticate, (req: AuthRequest, res: Response) => {
  try {
    const sessions = db.prepare(`
      SELECT ms.*, u.name as learner_name, u.avatar_url as learner_avatar,
             mp.headline as mentor_headline, mp.session_price
      FROM mentorship_sessions ms
      JOIN users u ON u.id = ms.learner_id
      LEFT JOIN mentor_profiles mp ON mp.id = ms.mentor_id
      WHERE ms.mentor_id = ? OR ms.learner_id = ?
      ORDER BY ms.created_at DESC
    `).all(req.userId, req.userId);

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;
