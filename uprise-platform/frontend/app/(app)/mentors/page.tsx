"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Star, ChevronRight, Search, Briefcase } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [loading] = useState(false);
  const mentors = [];

  const filteredMentors = mentors.filter((m: { name: string; headline: string; skills: string[] }) =>
    !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.headline.toLowerCase().includes(search.toLowerCase()) ||
    m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Find a Mentor</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Get guidance from working professionals
          </p>
        </div>
        <Link
          href="/mentor/apply"
          className="flex items-center gap-2 bg-accent hover:bg-amber-500 text-dark text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <GraduationCap className="w-4 h-4" /> Become a Mentor
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, industry, or skill..."
          className="flex-1 bg-transparent text-sm outline-none text-dark placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-extrabold text-dark mb-2">Mentors Coming Soon!</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
          We're onboarding working professionals as mentors. Be among the first to get mentorship
          from industry experts — sign up now to get early access.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-amber-500 hover:bg-amber-600 text-dark font-bold px-6 py-3 rounded-xl transition-colors">
            Get Early Access
          </button>
          <button className="bg-white hover:bg-slate-50 text-dark font-semibold px-6 py-3 rounded-xl border border-slate-200 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Placeholder Grid */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Coding & Tech", icon: "💻", count: 0 },
            { name: "Business & Marketing", icon: "💼", count: 0 },
            { name: "Design & Creative", icon: "🎨", count: 0 },
            { name: "Science & Research", icon: "🔬", count: 0 },
          ].map((cat) => (
            <button
              key={cat.name}
              className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-dark text-sm group-hover:text-primary transition-colors">
                {cat.name}
              </div>
              <div className="text-xs text-slate-400">{cat.count} mentors</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured placeholder */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4">How Mentorship Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Find a Mentor",
              desc: "Browse professionals by skill, industry, or topic. See their experience and ratings.",
            },
            {
              step: "2",
              title: "Book a Session",
              desc: "Request a session that fits your schedule. Pay securely through the platform.",
            },
            {
              step: "3",
              title: "Learn & Grow",
              desc: "Get 1-on-1 guidance, feedback on your work, and industry insights.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="text-4xl font-extrabold text-primary/15 mb-2">{item.step}</div>
              <h3 className="font-bold text-dark mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
