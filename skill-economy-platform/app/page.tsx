import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="font-bold text-white text-lg">SkillEdge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-2.5 rounded-xl hover:from-brand-500 hover:to-brand-400 transition-all shadow-lg shadow-brand-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-8 animate-fade-in">
            <span className="pulse-dot" />
            <span>Unified platform — all in one place</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
            One Platform.
            <br />
            <span className="gradient-text">All Your Work.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Post projects. Earn money. Learn from mentors. Track deadlines. Build proof of work.
            Everything in one place — no switching between apps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold rounded-2xl hover:from-brand-500 hover:to-brand-400 transition-all shadow-xl shadow-brand-500/30 text-center"
            >
              Get Started Free →
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all border border-white/10 text-center"
            >
              Explore Platform
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {[
              { num: '3-in-1', label: 'Worker + Learner + Mentor' },
              { num: '₹50L+', label: 'Paid to Students' },
              { num: '500+', label: 'Active Mentors' },
              { num: 'Geo Match', label: 'Location-based Tasks' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              You can be a task poster, worker, and mentee — all from one account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '📋',
                title: 'Post or Pick Up Tasks',
                desc: 'Post your assignments and projects, or browse and pick up work that matches your skills. Negotiate cost and deadline directly.',
                gradient: 'from-emerald-500/20 to-green-600/20 border-emerald-500/20',
              },
              {
                emoji: '🎓',
                title: 'Get Mentored',
                desc: 'Browse mentors by field, subject, or location. Apply online or find local mentors. Track your learning journey.',
                gradient: 'from-blue-500/20 to-cyan-600/20 border-blue-500/20',
              },
              {
                emoji: '📈',
                title: 'Build Your Profile',
                desc: 'Every task completed, session attended, and rating earned goes into your unified profile. Proof of work that speaks for itself.',
                gradient: 'from-neon-purple/20 to-pink-600/20 border-neon-purple/20',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`glass-card rounded-2xl p-6 card-hover border ${item.gradient}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything included</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { emoji: '📋', title: 'Assignments & Projects', desc: 'Post or pick up tasks. Online or physical delivery. Negotiate terms.' },
              { emoji: '📍', title: 'Location Matching', desc: 'Find tasks and mentors near you. Physical exchange support.' },
              { emoji: '🎓', title: 'Mentorship', desc: 'Browse and apply to mentors by field. Online or offline sessions.' },
              { emoji: '📅', title: 'Calendar & Deadlines', desc: 'Track all your deadlines in one calendar. Never miss a submission.' },
              { emoji: '⭐', title: 'Rating System', desc: 'Rate and get rated on every task and mentorship. Builds trust.' },
              { emoji: '💰', title: 'Payments', desc: 'Get paid for completed work. Secure transfer after approval.' },
              { emoji: '📂', title: 'Unified Profile', desc: 'Work history, learning record, ratings, and skills — all in one place.' },
              { emoji: '🔍', title: 'Smart Filters', desc: 'Filter tasks by subject, skill, budget, deadline, and location.' },
              { emoji: '🤝', title: 'Negotiation', desc: 'Discuss cost and timeline before accepting. Fair deals for everyone.' },
            ].map((feature, i) => (
              <div key={feature.title} className="glass-card rounded-2xl p-5 card-hover">
                <div className="text-3xl mb-3">{feature.emoji}</div>
                <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task types */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Two ways to deliver</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center card-hover border border-blue-500/20">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-lg font-bold text-white mb-2">Online Submission</h3>
              <p className="text-sm text-gray-400">Upload files, share documents, submit through the platform. Works for any digital deliverable.</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center card-hover border border-emerald-500/20">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-white mb-2">Physical Delivery</h3>
              <p className="text-sm text-gray-400">Notebook delivery, printed notes, hand-drawn diagrams. Filter by your area and pick up locally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-brand-500/20">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              One account. Unlimited potential.
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Post tasks, earn money, learn from pros, build your profile. No more juggling between apps — everything is here.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold rounded-2xl hover:from-brand-500 hover:to-brand-400 transition-all shadow-xl shadow-brand-500/30"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-xs">SE</span>
            </div>
            <span className="font-bold text-white">SkillEdge</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span>© 2026 SkillEdge</span>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}