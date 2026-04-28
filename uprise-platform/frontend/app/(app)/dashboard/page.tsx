"use client";

import { useProfile } from "@/hooks/useProfile";
import { Briefcase, TrendingUp, Users, Wallet, Zap, Plus, ChevronRight, Star, Clock, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, timeAgo } from "@/lib/utils";

const roleLabels: Record<string, { label: string; desc: string; color: string; icon: React.ReactNode }> = {
  learner: {
    label: "Learner",
    desc: "Post tasks and get them done",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: <Briefcase className="w-5 h-5" />,
  },
  earner: {
    label: "Earner",
    desc: "Browse tasks and earn money",
    color: "bg-secondary/10 text-secondary border-secondary/20",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  mentor: {
    label: "Mentor",
    desc: "Guide students and build your name",
    color: "bg-accent/10 text-accent border-accent/20",
    icon: <Users className="w-5 h-5" />,
  },
};

export default function DashboardPage() {
  const { profile, isLoading } = useProfile();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeRoles = profile?.roles?.filter((r) => r.active).map((r) => r.role_type) || [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark">
            Hey, {user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {activeRoles.length > 0
              ? `You're active as ${activeRoles.map((r) => roleLabels[r]?.label).join(", ")}`
              : "Set up your roles to get started"}
          </p>
        </div>
        <Link
          href="/tasks/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Task
        </Link>
      </div>

      {/* Role Switcher Hint */}
      {activeRoles.length === 0 && (
        <div className="bg-accent-50 border border-accent/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-dark">Set Up Your Roles</h3>
              <p className="text-sm text-slate-600">Toggle Learner, Earner, or Mentor in your profile</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-600 transition-colors"
          >
            Go to Profile <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Briefcase className="w-5 h-5" />,
            label: "Tasks Posted",
            value: profile?.stats?.tasks_posted ?? 0,
            color: "text-primary bg-primary/10",
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: "Completed",
            value: profile?.stats?.tasks_completed ?? 0,
            color: "text-secondary bg-secondary/10",
          },
          {
            icon: <Star className="w-5 h-5" />,
            label: "Avg Rating",
            value: "—",
            color: "text-accent bg-accent/10",
            suffix: "/5",
          },
          {
            icon: <Wallet className="w-5 h-5" />,
            label: "Earnings",
            value: "₹0",
            color: "text-emerald-600 bg-emerald-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-dark">{stat.value}{stat.suffix}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Roles */}
      {activeRoles.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-dark mb-3">My Active Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeRoles.map((role) => {
              const info = roleLabels[role];
              if (!info) return null;
              return (
                <div
                  key={role}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${info.color}`}
                >
                  <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="font-bold">{info.label}</div>
                    <div className="text-sm opacity-80">{info.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/tasks", label: "Browse Tasks", icon: <Briefcase className="w-5 h-5" />, color: "bg-primary/10 text-primary hover:bg-primary/20" },
            { href: "/tasks/create", label: "Post a Task", icon: <Plus className="w-5 h-5" />, color: "bg-secondary/10 text-secondary hover:bg-secondary/20" },
            { href: "/mentors", label: "Find Mentors", icon: <Users className="w-5 h-5" />, color: "bg-accent/10 text-accent hover:bg-accent/20" },
            { href: "/profile", label: "Edit Profile", icon: <User className="w-5 h-5" />, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${action.color} transition-colors text-center`}
            >
              <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center">
                {action.icon}
              </div>
              <span className="text-sm font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Verification Banner */}
      {profile && !profile.student_id_verified && (
        <div className="bg-primary-50 border border-primary/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-dark">Get Verified ✓</h3>
              <p className="text-sm text-slate-600 mt-1">
                Submit your student ID to get the verified badge and unlock full access.
              </p>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-600 transition-colors flex-shrink-0"
            >
              Verify Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

