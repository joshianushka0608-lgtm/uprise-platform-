"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FileText, Upload, MapPin, Clock, DollarSign, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
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

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    delivery_type: "online",
    location_city: "",
    deadline: "",
    base_budget: "",
    complexity: "medium",
    effort_hours: "2",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("uprise_token");
      const res = await api.post("/tasks", {
        ...form,
        base_budget: Number(form.base_budget) || 0,
        effort_hours: Number(form.effort_hours) || 2,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push(`/tasks/${res.data.task.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Failed to create task. Please try again.");
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const stepComplete = (n: number) => step > n;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Post a Task</h1>
        <p className="text-slate-500 text-sm mt-1">Get help from fellow students in minutes</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= n ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {stepComplete(n) ? <Check className="w-4 h-4" /> : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? "text-primary" : "text-slate-400"}`}>
              {n === 1 ? "Details" : n === 2 ? "Delivery" : "Budget"}
            </span>
            {n < 3 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Task Details
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What do you need? *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chemistry notes for Class 10 Chapter 5"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  required
                  maxLength={100}
                />
                <span className="text-xs text-slate-400 mt-1 block">{form.title.length}/100</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  className="form-input resize-none"
                  rows={4}
                  placeholder="Describe what you need in detail. Include any specific requirements, format, or instructions..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Complexity
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update("complexity", c)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                        form.complexity === c
                          ? "bg-primary text-white border-primary shadow-md"
                          : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => form.title && form.description && form.category ? setStep(2) : null}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Next: Delivery <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> Delivery Method
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">How will you receive the work? *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "online", label: "Online", desc: "File upload", icon: <Upload className="w-6 h-6" /> },
                    { value: "physical", label: "Physical", desc: "Notebook delivery", icon: <MapPin className="w-6 h-6" /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("delivery_type", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.delivery_type === opt.value
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                        form.delivery_type === opt.value ? "bg-primary/15 text-primary" : "bg-slate-100 text-slate-500"
                      }`}>
                        {opt.icon}
                      </div>
                      <div className="font-bold text-dark">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.delivery_type === "physical" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-1" /> Your City *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mumbai, Delhi, Bangalore"
                    value={form.location_city}
                    onChange={(e) => update("location_city", e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Clock className="w-4 h-4 inline mr-1" /> Deadline *
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.deadline}
                  onChange={(e) => update("deadline", e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Estimated Effort
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={form.effort_hours}
                  onChange={(e) => update("effort_hours", e.target.value)}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 hr</span>
                  <span className="font-bold text-primary">{form.effort_hours} hours</span>
                  <span>40 hrs</span>
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
                type="button"
                onClick={() => form.deadline ? setStep(3) : null}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                Next: Budget <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Set Your Budget
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  How much are you willing to pay? (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    className="form-input pl-8 text-xl font-bold"
                    placeholder="0"
                    value={form.base_budget}
                    onChange={(e) => update("base_budget", e.target.value)}
                    min={0}
                    step={10}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Fair prices get responses faster. Most tasks range from ₹50 – ₹500.
                </p>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 flex-wrap">
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => update("base_budget", String(amt))}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      Number(form.base_budget) === amt
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-primary-50 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-3">Task Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Title</span>
                  <span className="font-semibold text-dark">{form.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-dark">{form.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-semibold text-dark capitalize">{form.delivery_type}</span>
                </div>
                {form.location_city && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">City</span>
                    <span className="font-semibold text-dark">{form.location_city}</span>
                  </div>
                )}
                {form.deadline && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deadline</span>
                    <span className="font-semibold text-dark">
                      {new Date(form.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-primary/10 pt-2 mt-2">
                  <span className="text-slate-500 font-semibold">Budget</span>
                  <span className="font-extrabold text-primary text-lg">₹{form.base_budget || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post Task ✓"}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
