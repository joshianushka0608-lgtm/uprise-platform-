import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Initialize database
import "./db/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Rate limiting (basic)
const requestCounts = new Map<string, number[]>();
const rateLimit = (max = 100, windowMs = 60000) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const window = requestCounts.get(key) || [];
    const recent = window.filter((t) => now - t < windowMs);
    recent.push(now);
    requestCounts.set(key, recent);
    if (recent.length > max) {
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }
    next();
  };
};

app.use(rateLimit(100, 60000));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Categories route
import db, { Category } from "./db/index.js";
app.get("/api/categories", (_req, res) => {
  const categories = db.prepare("SELECT * FROM categories ORDER BY name").all() as Category[];
  res.json({ categories });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 UpRise API running on http://localhost:${PORT}`);
  console.log(`📁 Database: ${process.cwd()}/data/uprise.db`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? "✅ Set" : "⚠️ Using fallback — set JWT_SECRET in .env"}`);
});

export default app;
