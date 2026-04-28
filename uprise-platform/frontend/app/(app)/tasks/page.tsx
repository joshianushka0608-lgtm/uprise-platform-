"use client";

import { Briefcase, Search, Filter, Plus } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Task Marketplace</h1>
        <Link
          href="/tasks/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Post Task
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 bg-transparent text-sm outline-none text-dark"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">No tasks yet</h2>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
          Be the first to post a task! Get homework help, projects, or anything else done by fellow students.
        </p>
        <Link
          href="/tasks/create"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Post Your First Task
        </Link>
      </div>
    </div>
  );
}
