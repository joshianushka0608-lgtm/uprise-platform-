"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Shield,
  Briefcase,
  Star,
} from "lucide-react";

const roleOptions = [
  { value: "learner", label: "Learner", desc: "Post tasks, get mentored", color: "bg-primary" },
  { value: "earner", label: "Earner", desc: "Do tasks, earn money", color: "bg-secondary" },
  { value: "mentor", label: "Mentor", desc: "Guide students", color: "bg-accent" },
];

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, toggleRoles, addSkill, removeSkill, submitStudentId } =
    useProfile();
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: "",
    phone: "",
    city: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [skillError, setSkillError] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile.mutateAsync(form);
      updateUser({ name: form.name });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleToggle = async (roleType: string, currentlyActive: boolean) => {
    await toggleRoles.mutateAsync([{ role_type: roleType, active: !currentlyActive }]);
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    setSkillError("");
    try {
      await addSkill.mutateAsync(newSkill.trim());
      setNewSkill("");
    } catch {
      setSkillError("Failed to add skill");
    }
  };

  const handleStudentIdSubmit = async () => {
    if (!studentIdInput.trim()) return;
    await submitStudentId.mutateAsync(studentIdInput.trim());
    setStudentIdInput("");
  };

  const activeRoles = profile.roles.filter((r) => r.active).map((r) => r.role_type);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-secondary" />
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-10 mb-4 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-dark">{profile.name}</h1>
                {profile.student_id_verified ? (
                  <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm">
                {profile.city ? `${profile.city}, ${profile.state || ""}` : "Location not set"}
              </p>
            </div>
            {!editing ? (
              <button
                onClick={() => {
                  setForm({
                    name: profile.name,
                    bio: profile.bio || "",
                    phone: profile.phone || "",
                    city: profile.city || "",
                  });
                  setEditing(true);
                }}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary-600 transition-colors px-4 py-2 rounded-xl"
                >
                  <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {/* Edit form */}
          {editing ? (
            <div className="space-y-3 mt-2">
              {[
                { key: "name", label: "Name", icon: User, type: "text" },
                { key: "bio", label: "Bio", icon: Edit2, type: "text" },
                { key: "phone", label: "Phone", icon: Phone, type: "tel" },
                { key: "city", label: "City", icon: MapPin, type: "text" },
              ].map(({ key, label, icon: Icon, type }) => (
                <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type={type}
                    className="flex-1 bg-transparent text-sm text-dark outline-none"
                    placeholder={label}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> {profile.phone}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Student ID Verification */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-dark">Student ID Verification</h2>
            <p className="text-sm text-slate-500">
              {profile.student_id_verified
                ? "You're verified! 🎉"
                : "Submit your student ID to get the verified badge"}
            </p>
          </div>
        </div>

        {profile.student_id_verified ? (
          <div className="bg-secondary/10 rounded-xl p-4 text-sm text-secondary font-medium">
            ✓ Your student ID has been verified. You have full access.
          </div>
        ) : profile.student_id ? (
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 font-medium">
            ⏳ Your student ID is pending review. You'll be verified within 24 hours.
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 form-input"
              placeholder="Enter your student ID or roll number"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
            />
            <button
              onClick={handleStudentIdSubmit}
              disabled={!studentIdInput.trim() || submitStudentId.isPending}
              className="bg-primary hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex-shrink-0"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Roles */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-dark mb-4">Your Roles</h2>
        <p className="text-sm text-slate-500 mb-4">
          Toggle the modes you want to use. You can switch anytime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roleOptions.map((role) => {
            const isActive = activeRoles.includes(role.value);
            return (
              <button
                key={role.value}
                onClick={() => handleRoleToggle(role.value, isActive)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isActive
                    ? `${role.color} text-white border-transparent shadow-lg`
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="font-bold mb-1 capitalize">{role.label}</div>
                <div className={`text-xs ${isActive ? "text-white/80" : "text-slate-400"}`}>
                  {role.desc}
                </div>
                <div className="mt-2 text-xs font-semibold">
                  {isActive ? "✓ Active" : "Off"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-dark mb-4">Your Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {skill.skill_name}
              <span className="text-xs opacity-60 capitalize">({skill.skill_level})</span>
              <button
                onClick={() => removeSkill.mutate(skill.id)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {profile.skills.length === 0 && (
            <p className="text-sm text-slate-400">No skills added yet.</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 form-input text-sm"
            placeholder="Add a skill (e.g., Python, Essay Writing)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim() || addSkill.isPending}
            className="flex items-center gap-1.5 bg-secondary text-white font-semibold px-4 py-2 rounded-xl hover:bg-secondary-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {skillError && <p className="text-red-500 text-xs mt-2">{skillError}</p>}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-dark mb-4">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {profile.stats?.tasks_posted ?? 0}
            </div>
            <div className="text-sm text-slate-500">Tasks Posted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">
              {profile.stats?.tasks_completed ?? 0}
            </div>
            <div className="text-sm text-slate-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {0}
            </div>
            <div className="text-sm text-slate-500">Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
