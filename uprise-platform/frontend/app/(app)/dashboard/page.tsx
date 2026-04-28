"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  FileText,
  DollarSign,
  Users,
  BookOpen,
  Upload,
  Clock,
  ChevronRight,
  TrendingUp,
  Star,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isVerified = profile?.student_id_verified;
  const activeRoles = profile?.roles?.filter((r) => r.active).map((r) => r.role_type) || [];

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white px-4 md:px-8 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1">
                Hey, {user.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-primary-200 text-sm md:text-base">
                {isVerified
                  ? "You're verified — full access enabled ✓"
                  : "Complete your profile to unlock all features"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 bg-accent text-dark text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-400 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Verify Now
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Tasks Done", value: profile?.stats?.tasks_completed ?? 0, icon: Briefcase },
              { label: "Skills", value: profile?.skills?.length ?? 0, icon: Star },
              { label: "Earnings", value: "₹0", icon: DollarSign },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                <stat.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* Role Switcher Banner */}
        {activeRoles.length === 0 && (
          <div className="bg-accent-50 border-2 border-accent/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-dark text-lg">Choose Your Mode</h3>
                <p className="text-sm text-slate-600">Pick Learner, Earner, or Mentor to unlock features</p>
              </div>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-amber-600 transition-colors"
            >
              Set up your roles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* === MAIN ACTION CARDS === */}
        <div>
          <h2 className="text-lg font-bold text-dark mb-4">What do you want to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Post Homework */}
            <ActionCard
              href="/tasks/create"
              icon={<FileText className="w-7 h-7" />}
              title="Post Homework"
              desc="Need help? Post your assignment, project, or notes — set a budget and deadline."
              color="primary"
              badge="Learner"
            />

            {/* Apply for Homework Work */}
            <ActionCard
              href="/tasks/browse"
              icon={<DollarSign className="w-7 h-7" />}
              title="Apply for HW Work"
              desc="Want to earn? Browse available tasks, apply, and get paid for completed work."
              color="secondary"
              badge="Earner"
            />

            {/* Find a Mentor */}
            <ActionCard
              href="/mentors"
              icon={<GraduationCap className="w-7 h-7" />}
              title="Find a Mentor"
              desc="Learn from working professionals. Book sessions, get guidance, build your skills."
              color="teal"
              badge="Learn"
            />

            {/* Become a Mentor */}
            <ActionCard
              href="/mentor/apply"
              icon={<Users className="w-7 h-7" />}
              title="Become a Mentor"
              desc="Share your knowledge. Create a mentor profile and start earning from sessions."
              color="amber"
              badge="Mentor"
            />

          </div>
        </div>

        {/* === UPLOAD HOMEWORK SECTION === */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Upload Homework</h3>
                <p className="text-sm text-slate-500">Submit completed work for tasks you've accepted</p>
              </div>
            </div>
            <Link
              href="/my-tasks"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              View My Tasks <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-slate-500">Drop files here or <span className="text-primary font-semibold">browse</span></p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP, Images</p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Link
                  href="/my-tasks"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" /> Submit Work
                </Link>
                <Link
                  href="/tasks/browse"
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-dark font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Browse Available Tasks
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* === MY TASKS === */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">My Tasks</h2>
            <Link
              href="/my-tasks"
              className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4 inline" />
            </Link>
          </div>
          <div className="space-y-3">
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title="No tasks yet"
              desc="Post your first task or apply to earn from others."
              action={{ label: "Browse Tasks", href: "/tasks/browse" }}
            />
          </div>
        </div>

        {/* === MENTORSHIPS === */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">My Mentorships</h2>
            <Link
              href="/mentorships"
              className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4 inline" />
            </Link>
          </div>
          <div className="space-y-3">
            <EmptyState
              icon={<GraduationCap className="w-6 h-6" />}
              title="No mentorships yet"
              desc="Find a mentor or apply to guide students."
              action={{ label: "Find a Mentor", href: "/mentors" }}
            />
          </div>
        </div>

        {/* === WALLET === */}
        <div className="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-primary-200 font-medium">Available Balance</div>
                <div className="text-3xl font-extrabold">₹0</div>
              </div>
            </div>
            <Link
              href="/wallet"
              className="flex items-center gap-1 text-sm font-bold text-white/80 hover:text-white transition-colors"
            >
              View Wallet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-primary-200">Total Earned</div>
              <div className="font-bold">₹0</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-primary-200">In Escrow</div>
              <div className="font-bold">₹0</div>
            </div>
          </div>
        </div>

        {/* === SKILLS === */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark">My Skills</h3>
            <Link
              href="/profile"
              className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Edit <ChevronRight className="w-4 h-4 inline" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile?.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  {skill.skill_name}
                  {skill.verified ? (
                    <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                  ) : null}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No skills yet. <Link href="/profile" className="text-primary font-medium">Add some</Link>
              </p>
            )}
          </div>
        </div>

        {/* === UPCOMING DEADLINES === */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-dark">Upcoming Deadlines</h3>
              <p className="text-sm text-slate-500">No deadlines yet</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  desc,
  color,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "primary" | "secondary" | "teal" | "amber";
  badge: string;
}) {
  const colorMap = {
    primary: {
      bg: "bg-primary/5 hover:bg-primary/10",
      border: "border-primary/20 hover:border-primary/40",
      icon: "bg-primary/15 text-primary",
      title: "text-dark",
      badge: "bg-primary/10 text-primary",
    },
    secondary: {
      bg: "bg-secondary/5 hover:bg-secondary/10",
      border: "border-secondary/20 hover:border-secondary/40",
      icon: "bg-secondary/15 text-secondary",
      title: "text-dark",
      badge: "bg-secondary/10 text-secondary",
    },
    teal: {
      bg: "bg-teal-50 hover:bg-teal-100",
      border: "border-teal-200 hover:border-teal-300",
      icon: "bg-teal-100 text-teal-600",
      title: "text-dark",
      badge: "bg-teal-100 text-teal-700",
    },
    amber: {
      bg: "bg-amber-50 hover:bg-amber-100",
      border: "border-amber-200 hover:border-amber-300",
      icon: "bg-amber-100 text-amber-600",
      title: "text-dark",
      badge: "bg-amber-100 text-amber-700",
    },
  };

  const c = colorMap[color];

  return (
    <Link
      href={href}
      className={`group block p-5 rounded-2xl border-2 ${c.bg} ${c.border} transition-all hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-lg ${c.title} group-hover:text-primary transition-colors`}>
              {title}
            </h3>
          </div>
          <span className={`inline-block text-xs font-semibold ${c.badge} px-2 py-0.5 rounded-full mb-2`}>
            {badge}
          </span>
          <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
          <div className="flex items-center gap-1 mt-3 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Get Started <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-dark">{title}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </div>
      <Link
        href={action.href}
        className="text-sm font-semibold text-primary hover:text-primary-600 transition-colors flex-shrink-0"
      >
        {action.label} →
      </Link>
    </div>
  );
}
