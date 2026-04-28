import { Router, Response } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { AuthRequest } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import db, { User } from "../db/index.js";

const router = Router();

// Browse tasks
router.get("/", (req, res) => {
  try {
    const { category, status = "open", search, min_budget, max_budget, location_city } = req.query;

    let query = "SELECT t.*, u.name as poster_name, u.avatar_url as poster_avatar FROM tasks t JOIN users u ON u.id = t.poster_id WHERE 1=1";
    const params: unknown[] = [];

    if (status) { query += " AND t.status = ?"; params.push(status); }
    if (category) { query += " AND t.category = ?"; params.push(category); }
    if (search) { query += " AND (t.title LIKE ? OR t.description LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
    if (min_budget) { query += " AND t.base_budget >= ?"; params.push(Number(min_budget)); }
    if (max_budget) { query += " AND t.base_budget <= ?"; params.push(Number(max_budget)); }
    if (location_city) { query += " AND t.location_city LIKE ?"; params.push(`%${location_city}%`); }

    query += " ORDER BY t.created_at DESC LIMIT 50";

    const tasks = db.prepare(query).all(...params);
    res.json({ tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create task
router.post(
  "/",
  authenticate,
  validate([
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("deadline").notEmpty().withMessage("Deadline is required"),
    body("delivery_type").isIn(["online", "physical"]).withMessage("Invalid delivery type"),
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title, description, category, deadline, delivery_type,
        location_city, base_budget, complexity, effort_hours,
      } = req.body;

      const taskId = uuidv4();
      const userId = req.userId!;

      db.prepare(`
        INSERT INTO tasks (id, poster_id, title, description, category, deadline, delivery_type, location_city, base_budget, complexity, effort_hours, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
      `).run(taskId, userId, title, description, category, deadline, delivery_type, location_city || null, base_budget || 0, complexity || 'medium', effort_hours || 2);

      const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
      res.status(201).json({ message: "Task created", task });
    } catch (err) {
      console.error("Create task error:", err);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

// Get single task
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = db.prepare(`
      SELECT t.*, u.name as poster_name, u.avatar_url as poster_avatar,
             u.city as poster_city, u.student_id_verified
      FROM tasks t
      JOIN users u ON u.id = t.poster_id
      WHERE t.id = ?
    `).get(id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Get applications if requester is poster
    const authHeader = req.headers.authorization;
    let isOwner = false;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const jwt = await import("jsonwebtoken");
      const secret = process.env.JWT_SECRET || "fallback-secret";
      try {
        const decoded = jwt.default.verify(token, secret) as { userId: string };
        isOwner = (task as Record<string, unknown>).poster_id === decoded.userId;
      } catch {}
    }

    let applications: unknown[] = [];
    if (isOwner) {
      applications = db.prepare(`
        SELECT ta.*, u.name as applicant_name, u.avatar_url as applicant_avatar
        FROM task_applications ta
        JOIN users u ON u.id = ta.applicant_id
        WHERE ta.task_id = ?
        ORDER BY ta.created_at DESC
      `).all(id);
    }

    res.json({ task: { ...task, applications } });
  } catch (err) {
    console.error("Get task error:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Apply for task
router.post("/:id/apply", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message, proposed_amount } = req.body;
    const applicantId = req.userId!;

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    if (task.status !== "open") { res.status(400).json({ error: "Task is not open" }); return; }
    if (task.poster_id === applicantId) { res.status(400).json({ error: "Cannot apply to your own task" }); return; }

    const existing = db.prepare("SELECT id FROM task_applications WHERE task_id = ? AND applicant_id = ?").get(id, applicantId);
    if (existing) { res.status(409).json({ error: "Already applied" }); return; }

    const appId = uuidv4();
    db.prepare(`
      INSERT INTO task_applications (id, task_id, applicant_id, message, proposed_amount, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(appId, id, applicantId, message || "", proposed_amount || task.base_budget || 0);

    res.status(201).json({ message: "Application submitted", application_id: appId });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ error: "Failed to apply" });
  }
});

// Accept application
router.put("/:id/accept/:applicationId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id, applicationId } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    if (task.poster_id !== req.userId) { res.status(403).json({ error: "Only poster can accept" }); return; }

    const app = db.prepare("SELECT * FROM task_applications WHERE id = ? AND task_id = ?").get(applicationId, id) as Record<string, unknown> | undefined;
    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    // Accept and update task status
    db.prepare("UPDATE task_applications SET status = 'accepted' WHERE id = ?").run(applicationId);
    db.prepare("UPDATE task_applications SET status = 'rejected' WHERE task_id = ? AND id != ?").run(id, applicationId);
    db.prepare("UPDATE tasks SET status = 'in_progress', accepted_by = ?, final_budget = ?, updated_at = datetime('now') WHERE id = ?")
      .run(app.applicant_id, app.proposed_amount, id);

    res.json({ message: "Application accepted", task_id: id });
  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ error: "Failed to accept application" });
  }
});

// Submit work
router.post("/:id/submit", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { submission_url } = req.body;

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    if (task.accepted_by !== req.userId) { res.status(403).json({ error: "Not assigned to you" }); return; }
    if (task.status !== "in_progress") { res.status(400).json({ error: "Task not in progress" }); return; }

    db.prepare("UPDATE tasks SET status = 'submitted', submission_url = ?, updated_at = datetime('now') WHERE id = ?")
      .run(submission_url || "", id);

    res.json({ message: "Work submitted" });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Failed to submit work" });
  }
});

// Approve task
router.put("/:id/approve", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    if (task.poster_id !== req.userId) { res.status(403).json({ error: "Only poster can approve" }); return; }
    if (task.status !== "submitted") { res.status(400).json({ error: "Task not submitted" }); return; }

    db.prepare("UPDATE tasks SET status = 'completed', reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(id);

    // Auto-skill tagging: extract skills from task category
    const category = task.category as string;
    const skillMap: Record<string, string[]> = {
      "Academic Writing": ["academic writing", "essay writing", "research"],
      "Coding & Development": ["coding", "web development", "programming"],
      "Design & Creative": ["graphic design", "creative writing", "design"],
      "Mathematics": ["mathematics", "calculus", "algebra"],
      "Science": ["science", "physics", "chemistry", "biology"],
      "Data Entry & Typing": ["data entry", "typing", "microsoft excel"],
      "Language & Translation": ["language", "translation", "english"],
      "Marketing & Social Media": ["digital marketing", "social media", "content writing"],
    };

    const skills = skillMap[category] || [category.toLowerCase()];
    const earnerId = task.accepted_by as string;
    for (const skill of skills) {
      const existing = db.prepare("SELECT id FROM user_skills WHERE user_id = ? AND LOWER(skill_name) = ?")
        .get(earnerId, skill.toLowerCase());
      if (!existing) {
        db.prepare("INSERT INTO user_skills (id, user_id, skill_name, skill_level, verified) VALUES (?, ?, ?, 'intermediate', 0)")
          .run(uuidv4(), earnerId, skill);
      }
    }

    res.json({ message: "Task approved and completed", task_id: id });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve task" });
  }
});

// My posted tasks
router.get("/my/posted", authenticate, (req: AuthRequest, res) => {
  try {
    const tasks = db.prepare("SELECT * FROM tasks WHERE poster_id = ? ORDER BY created_at DESC").all(req.userId);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// My accepted tasks
router.get("/my/accepted", authenticate, (req: AuthRequest, res) => {
  try {
    const tasks = db.prepare("SELECT * FROM tasks WHERE accepted_by = ? ORDER BY created_at DESC").all(req.userId);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

export default router;
