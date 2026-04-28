"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft, MapPin, Clock, DollarSign, User, Star,
  CheckCircle, Send, MessageSquare, Shield, Upload,
  ChevronRight
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [task, setTask] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [appError, setAppError] = useState("");
  const [submittingWork, setSubmittingWork] = useState(false);
  const [workUrl, setWorkUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("uprise_token");
    api.get(`/tasks/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => {
      setTask(res.data.task);
    }).catch(() => {
      // Task not found
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 text-center py-20">
        <h2 className="text-xl font-bold text-dark mb-2">Task not found</h2>
        <p className="text-slate-500 mb-6">This task may have been removed or is no longer available.</p>
        <Link href="/tasks/browse" className="text-primary font-semibold hover:underline">
          Browse all tasks →
        </Link>
      </div>
    );
  }

  const status = (task.status as string) || "open";
  const isOwner = (task.poster_id as string) === user?.id;
  const isEarner = user && task.status === "open" && !isOwner;

  const statusConfig: Record<string, { color: string; label: string }> = {
    open: { color: "bg-secondary/10 text-secondary border-secondary/20", label: "Open — Apply Now" },
    in_progress: { color: "bg-amber-50 text-amber-600 border-amber-200", label: "In Progress" },
    submitted: { color: "bg-primary/10 text-primary border-primary/20", label: "Submitted — Awaiting Approval" },
    completed: { color: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Completed ✓" },
    cancelled: { color: "bg-red-50 text-red-600 border-red-200", label: "Cancelled" },
  };

  const handleApply = async () => {
    if (!user) return;
    setAppError("");
    setApplying(true);

    try {
      const token = localStorage.getItem("uprise_token");
      await api.post(`/tasks/${id}/apply`, {
        message: applyMsg,
        proposed_amount: Number(proposedAmount) || Number(task.base_budget),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh
      const res = await api.get(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTask(res.data.task);
      setApplyMsg("");
      setProposedAmount("");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setAppError(e.response?.data?.error || "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleSubmitWork = async () => {
    setSubmittingWork(true);
    try {
      const token = localStorage.getItem("uprise_token");
      await api.post(`/tasks/${id}/submit`, {
        submission_url: workUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh
      const res = await api.get(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTask(res.data.task);
      setWorkUrl("");
    } catch {
      // Handle error
    } finally {
      setSubmittingWork(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      {/* Back */}
      <Link href="/tasks/browse" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 capitalize ${statusConfig[status]?.color}`}>
                {statusConfig[status]?.label}
              </span>
              <h1 className="text-2xl font-extrabold text-dark mb-2">{task.title as string}</h1>
              <p className="text-slate-600 leading-relaxed">{task.description as string}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
            {task.base_budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-xs text-slate-500">Budget</div>
                  <div className="font-bold text-emerald-600">{formatCurrency(Number(task.base_budget))}</div>
                </div>
              </div>
            )}
            {task.deadline && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-xs text-slate-500">Deadline</div>
                  <div className="font-semibold text-dark">{formatDate(task.deadline as string)}</div>
                </div>
              </div>
            )}
            {task.location_city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="font-semibold text-dark">{task.location_city as string}</div>
                </div>
              </div>
            )}
            {task.complexity && (
              <div className="ml-auto">
                <div className="text-xs text-slate-500">Complexity</div>
                <div className="font-semibold capitalize text-dark">{task.complexity as string}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply / Submit Work */}
      {isEarner && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" /> Apply for this Task
          </h3>

          {appError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{appError}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your proposed amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder={`Suggested: ₹${task.base_budget || 0}`}
                value={proposedAmount}
                onChange={(e) => setProposedAmount(e.target.value)}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Message to poster
              </label>
              <textarea
                className="form-input resize-none"
                rows={3}
                placeholder="Introduce yourself and explain why you're the right person for this task..."
                value={applyMsg}
                onChange={(e) => setApplyMsg(e.target.value)}
              />
            </div>
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {applying ? "Applying..." : "Apply Now ✓"}
            </button>
          </div>
        </div>
      )}

      {/* Earner's submit work */}
      {!isOwner && task.accepted_by === user?.id && task.status === "in_progress" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-secondary" /> Submit Your Work
          </h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {task.delivery_type === "online" ? "Upload your work (link)" : "Mark as delivered"}
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                className="form-input flex-1"
                placeholder="Paste Google Drive, Dropbox, or file link..."
                value={workUrl}
                onChange={(e) => setWorkUrl(e.target.value)}
              />
              <button
                onClick={handleSubmitWork}
                disabled={submittingWork}
                className="bg-secondary hover:bg-secondary-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 flex-shrink-0"
              >
                {submittingWork ? "..." : "Submit ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster actions */}
      {isOwner && status === "open" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Applications
          </h3>
          {task.applications && (task.applications as unknown[])?.length > 0 ? (
            <div className="space-y-3">
              {(task.applications as unknown[]).map((app: Record<string, unknown>) => (
                <div key={app.id as string} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-dark">{app.applicant_name || "Applicant"}</div>
                    <div className="text-sm text-slate-500">{app.message as string}</div>
                    <div className="text-sm font-bold text-emerald-600 mt-1">
                      ₹{app.proposed_amount || task.base_budget}
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-white bg-secondary hover:bg-secondary-600 px-4 py-2 rounded-lg transition-colors">
                    Accept ✓
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No applications yet. Share your task to get responses!</p>
          )}
        </div>
      )}

      {/* Poster approve/reject */}
      {isOwner && status === "submitted" && (
        <div className="bg-white rounded-2xl border border-primary/30 p-6 text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-dark text-lg mb-2">Work Submitted!</h3>
          <p className="text-slate-500 mb-4 text-sm">Review the submitted work and approve or request changes.</p>
          <div className="flex gap-3 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Approve & Release Payment ✓
            </button>
            <button className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-6 py-3 rounded-xl transition-colors border border-red-200">
              Request Changes
            </button>
          </div>
        </div>
      )}

      {/* Poster: mark completed */}
      {isOwner && status === "completed" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-emerald-700 text-lg mb-1">Task Completed!</h3>
          <p className="text-emerald-600 text-sm">Payment has been released to the earner.</p>
        </div>
      )}

      {/* Not logged in */}
      {!user && (
        <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-dark mb-2">Want to work on this task?</h3>
          <p className="text-slate-500 text-sm mb-4">Sign up or log in to apply and start earning.</p>
          <Link href="/register" className="inline-block bg-primary hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            Sign Up Free
          </Link>
        </div>
      )}

    </div>
  );
}
