"use client";

import { Users, Search } from "lucide-react";

export default function MentorsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-dark mb-6">Find Mentors</h1>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by skill or industry..."
            className="flex-1 bg-transparent text-sm outline-none text-dark"
          />
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">Mentors coming soon</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          Working professionals will join as mentors. Get industry guidance, career advice, and skill-specific mentorship.
        </p>
      </div>
    </div>
  );
}
