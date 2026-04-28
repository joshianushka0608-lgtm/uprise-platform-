"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { GraduationCap, ArrowRight, Check, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const INDUSTRIES = [
  "Technology & Software",
  "Marketing & Digital",
  "Design & Creative",
  "Finance & Banking",
  "Consulting",
  "Education & Training",
  "Media & Entertainment",
  "Healthcare",
  "Other",
];

export default function BecomeMentorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    headline: "",
    industry: "",
    years_exp: "",
    skills: "",
    session_price: "200",
    free_sessions: "1",
    bio: "",
    mode: "online",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("uprise_token");
      await api.post("/mentors/profile", {
        ...form,
        years_exp: Number(form.years_exp) || 0,
        session_price: Number(form.session_price) || 200,
        free_sessions: Number(form.free_sessions) || 0,
        skills_json: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        free_slots_json: [],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Failed to create mentor profile. Please try again.");
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-dark">Become a Mentor</h1>
        <p className="text-slate-500 text-sm mt-1">
          Share your expertise, help students grow, and earn from mentoring.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= n ? "bg-accent text-dark" : "bg-slate-200 text-slate-500"
            }`}>
              {step > n ? <Check className="w-4 h-4" /> : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? "text-dark" : "text-slate-400"}`}>
              {n === 1 ? "Your Profile" : "Pricing"}
            </span>
            {n < 2 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" /> About You
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Software Engineer at Google | 5 Years Experience"
                  value={form.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Industry *
                </label>
                <select
                  className="form-input"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  required
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 3"
                  value={form.years_exp}
                  onChange={(e) => update("years_exp", e.target.value)}
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Your Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Python, Data Science, Machine Learning"
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Students will search for mentors by these skills.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Bio / Description
                </label>
                <textarea
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Tell students about your background, what you can help with, and your teaching style..."
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => form.headline && form.industry && form.years_exp ? setStep(2) : null}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-dark font-bold py-3.5 rounded-xl transition-colors"
            >
              Next: Pricing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-bold text-dark">Set Your Pricing</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Session Price (₹ per 30 min)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    className="form-input pl-8 text-xl font-bold"
                    value={form.session_price}
                    onChange={(e) => update("session_price", e.target.value)}
                    min={0}
                    step={50}
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[100, 200, 500, 1000].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update("session_price", String(p))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        Number(form.session_price) === p
                          ? "bg-accent text-dark border-accent"
                          : "bg-white text-slate-600 border-slate-200 hover:border-accent/40"
                      }`}
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Free Sessions to Offer (optional)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={form.free_sessions}
                  onChange={(e) => update("free_sessions", e.target.value)}
                  min={0}
                  max={3}
                />
                <p className="text-xs text-slate-400 mt-1">Offer a free intro session to attract mentees.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Session Mode
                </label>
                <div className="flex gap-3">
                  {["online", "offline", "both"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => update("mode", mode)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border capitalize transition-all ${
                        form.mode === mode
                          ? "bg-accent text-dark border-accent"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {mode === "both" ? "Online + Offline" : mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-2">Your Mentor Profile Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Headline</span>
                  <span className="font-semibold">{form.headline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-semibold">{form.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-semibold">{form.years_exp} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Price</span>
                  <span className="font-extrabold text-amber-600">₹{form.session_price}/session</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-dark font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Mentor Profile ✓"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
