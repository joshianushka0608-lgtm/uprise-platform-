import { initDatabase } from "./index.js";
import db from "./index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Seed categories
const categories = [
  { name: "Academic Writing", slug: "academic-writing", icon: "📝" },
  { name: "Coding & Development", slug: "coding", icon: "💻" },
  { name: "Design & Creative", slug: "design", icon: "🎨" },
  { name: "Marketing & Social Media", slug: "marketing", icon: "📢" },
  { name: "Research & Analysis", slug: "research", icon: "🔬" },
  { name: "Language & Translation", slug: "language", icon: "🌍" },
  { name: "Data Entry & Typing", slug: "data-entry", icon: "⌨️" },
  { name: "Video Editing", slug: "video-editing", icon: "🎬" },
  { name: "Mathematics", slug: "mathematics", icon: "📐" },
  { name: "Science", slug: "science", icon: "🧪" },
  { name: "Business & Finance", slug: "business", icon: "💼" },
  { name: "Music & Audio", slug: "music", icon: "🎵" },
  { name: "Other", slug: "other", icon: "📌" },
];

async function seed() {
  // Wait for DB to be ready
  await initDatabase();

  const insertCategory = db.prepare(
    "INSERT OR IGNORE INTO categories (id, name, slug, icon) VALUES (?, ?, ?, ?)"
  );

  for (const cat of categories) {
    insertCategory.run(uuidv4(), cat.name, cat.slug, cat.icon);
  }

  // Seed a demo admin user
  const demoEmail = "demo@uprise.app";
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail);

  if (!existing) {
    const hash = await bcrypt.hash("demo1234", 10);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, phone, bio, city, state, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      demoEmail,
      hash,
      "Demo User",
      "+919876543210",
      "Exploring the UpRise platform!",
      "Mumbai",
      "Maharashtra",
      1
    );
    console.log("✅ Demo user created: demo@uprise.app / demo1234");
  }

  console.log("✅ Database seeded with categories");
  console.log(`📁 Database location: ${process.cwd()}/data/uprise.db`);
}

seed().catch(console.error);
