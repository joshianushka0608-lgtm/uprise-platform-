"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Users, Shield, TrendingUp, ArrowRight, BookOpen, Briefcase, GraduationCap, Award } from "lucide-react";

const features = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Post Tasks",
    desc: "Need homework help? Post a task with your budget and deadline. Get it done.",
    color: "from-primary-500 to-primary-600",
    role: "Learner",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Earn Money",
    desc: "Have skills? Browse tasks that match you, negotiate your rate, and get paid.",
    color: "from-secondary-500 to-secondary-600",
    role: "Earner",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Get Mentored",
    desc: "Book sessions with working professionals. Learn industry skills from people who've done it.",
    color: "from-accent-400 to-accent-500",
    role: "Learner",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Be a Mentor",
    desc: "Share your expertise, build your reputation, and earn from helping students grow.",
    color: "from-primary-400 to-secondary-500",
    role: "Mentor",
  },
];

const steps = [
  {
    num: "01",
    title: "Sign Up & Verify",
    desc: "Register with your phone. Submit your student ID for verification — takes 24 hours.",
  },
  {
    num: "02",
    title: "Choose Your Mode",
    desc: "Toggle between Learner, Earner, and Mentor. One account, all modes.",
  },
  {
    num: "03",
    title: "Build Your Proof",
    desc: "Every task completed, every session done — recorded as verified proof of your skills.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">UpRise</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-primary hover:bg-primary-600 transition-colors px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              For Indian Students — Classes 9 to College
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-dark mb-6 leading-tight">
              Your Skills.
              <br />
              <span className="gradient-text">Your Proof.</span>
              <br />
              Your Pay.
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop losing homework in WhatsApp groups. Post tasks, earn money,
              get mentored, and build a verified portfolio — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Start for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-dark font-semibold px-8 py-4 rounded-xl text-lg border border-slate-200 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              No credit card required • Escrow-protected payments • OTP + ID verified users
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Everything in One Account
            </h2>
            <p className="text-lg text-slate-600">
              Switch modes instantly. Everything connects to your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-surface rounded-2xl p-6 border border-slate-100 hover:border-primary/30 transition-all hover:shadow-lg group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                <span className="inline-block mt-3 text-xs font-medium text-primary bg-primary-50 px-3 py-1 rounded-full">
                  {feature.role} Mode
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              From zero to earning in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative"
              >
                <div className="text-7xl font-extrabold text-primary/10 mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 border-t-2 border-dashed border-slate-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Money is Always Protected
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Every payment is held in escrow until you approve the work. No work done, no money paid.
            Verified student IDs mean real people, real accountability.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" /> OTP-verified users
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Escrow-protected payments
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Verified student ID
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Ready to UpRise?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join students who are earning, learning, and building proof of their skills.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-10 py-5 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">UpRise</span>
            <span className="text-slate-500">— cornutub.xyz</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} UpRise. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
