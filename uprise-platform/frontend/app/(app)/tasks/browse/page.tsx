"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Briefcase, MapPin, Clock, DollarSign, Upload, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  "All Categories",
  "Academic Writing",
  "Coding & Development",
  "Design & Creative",
  "Marketing & Social Media",
  "Research & Analysis",
  "Language & Translation",
  "Data Entry & Typing",
  "Mathematics",
  "Science",
  "Business & Finance",
  "Music & Audio",
  "Other",
];

export default function BrowseTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [filterOpen, setFilterOpen] = useState(false);

  // Load tasks from API
  useState(() => {
    api.get("/tasks").then((res) => {
      setTasks(res.data.tasks || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  });

  const filteredTasks = tasks.filter((task: Record<string, unknown>) => {
    const matchesSearch = search === "" ||
      String(task.title).toLowerCase().includes(search.toLowerCase()) ||
      String(task.description).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All Categories" || task.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Browse Tasks</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? "Loading..." : `${filteredTasks.length} tasks available`}
          </p>
        </div>
        <Link
          href="/tasks/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Briefcase className="w-4 h-4" /> Post a Task
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks, skills, subjects..."
            className="flex-1 bg-transparent text-sm outline-none text-dark placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "bg-white border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
              <div className="flex gap-4">
                <div className="h-4 bg-slate-100 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No tasks found</h2>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            {search || category !== "All Categories"
              ? "Try adjusting your filters or search term."
              : "Be the first to post a task on UpRise!"}
          </p>
          <Link
            href="/tasks/create"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Briefcase className="w-4 h-4" /> Post First Task
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task: Record<string, unknown>) => (
            <TaskCard key={task.id as string} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Record<string, unknown> }) {
  const statusColors: Record<string, string> = {
    open: "bg-secondary/10 text-secondary border-secondary/20",
    in_progress: "bg-amber-50 text-amber-600 border-amber-200",
    submitted: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  const status = (task.status as string) || "open";
  const deadline = task.deadline ? new Date(task.deadline as string).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) : null;

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/30 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark text-lg group-hover:text-primary transition-colors line-clamp-1">
            {task.title as string}
          </h3>
          <p className="text-slate-500 text-sm mt-1 line-clamp-2">{task.description as string}</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusColors[status]}`}>
          {status.replace("_", " ")}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {task.base_budget && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <DollarSign className="w-4 h-4" />
            {formatCurrency(Number(task.base_budget))}
          </span>
        )}
        {deadline && (
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {deadline}
          </span>
        )}
        {task.location_city && (
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="w-4 h-4" />
            {task.location_city as string}
          </span>
        )}
        {task.category && (
          <span className="ml-auto text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            {task.category as string}
          </span>
        )}
      </div>
    </Link>
  );
}
