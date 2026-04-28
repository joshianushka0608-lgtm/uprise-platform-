'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { BottomNav } from '@/components/BottomNav';
import { InterestTree } from '@/components/InterestTree';
import { INTEREST_TREE } from '@/lib/interests';
import { getInterestLabel, getInterestEmoji } from '@/lib/interests';
import { User, DollarSign, Briefcase, BookOpen, Settings, ChevronRight, Shield } from 'lucide-react';

export default function ProfilePage() {
  const [tab, setTab] = useState<'overview' | 'interests' | 'settings'>('overview');
  const [profile, setProfile] = useState({
    name: '',
    school: '',
    admissionNumber: '',
    email: '',
    identity: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('uprise_name') || '';
      const identity = localStorage.getItem('uprise_identity') || '';
      setProfile({ name, school: '', admissionNumber: '', email: '', identity });
      const stored = localStorage.getItem('uprise_interests');
      if (stored) setSelectedInterests(JSON.parse(stored));
    }
  }, []);

  const saveInterests = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('uprise_interests', JSON.stringify(selectedInterests));
    }
    setEditMode(false);
  };

  const stats = [
    { label: 'Earned', value: '₹0', icon: DollarSign, color: '#E07A2F' },
    { label: 'Completed', value: '0', icon: Briefcase, color: '#22c55e' },
    { label: 'Learning', value: '0 topics', icon: BookOpen, color: '#3A86FF' },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Top nav */}
      <header className="top-nav">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Logo size="sm" />
          <button
            onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#6B6B73' }}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="px-5 pt-5 max-w-lg mx-auto space-y-5">
        {/* Profile header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #E07A2F, #F09040)' }}
            >
              {profile.name ? profile.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{profile.name || 'Set up your profile'}</h1>
              <p className="text-sm capitalize" style={{ color: '#6B6B73' }}>
                {profile.identity || 'Student'}
              </p>
              {!profile.name && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs font-medium mt-1"
                  style={{ color: '#E07A2F' }}
                >
                  Complete setup →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '50ms' }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="text-sm font-bold text-white">{value}</p>
              <p className="text-xs" style={{ color: '#6B6B73' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl animate-fade-up" style={{ animationDelay: '100ms', background: 'rgba(255,255,255,0.04)' }}>
          {(['overview', 'interests', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={tab === t ? { background: '#E07A2F', color: 'white' } : { color: '#6B6B73' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-3 animate-fade-up" style={{ animationDelay: '130ms' }}>
            {/* Profile fields */}
            {editMode ? (
              <div className="card p-4 space-y-3">
                <h2 className="text-sm font-semibold" style={{ color: '#A0A0A8' }}>Basic Info</h2>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#6B6B73' }}>Name</label>
                  <input className="input-field" placeholder="Your name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#6B6B73' }}>School / College</label>
                  <input className="input-field" placeholder="e.g., Delhi Public School" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-1 flex items-center gap-1" style={{ color: '#6B6B73' }}>
                    <Shield size={10} /> Admission Number (private)
                  </label>
                  <input className="input-field" placeholder="Not visible publicly" value={profile.admissionNumber} onChange={(e) => setProfile({ ...profile, admissionNumber: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('uprise_name', profile.name);
                      localStorage.setItem('uprise_school', profile.school);
                      localStorage.setItem('uprise_admission', profile.admissionNumber);
                    }
                    setEditMode(false);
                  }} className="btn-orange flex-1 py-2 text-sm">Save</button>
                  <button onClick={() => setEditMode(false)} className="btn-ghost flex-1 py-2 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold" style={{ color: '#A0A0A8' }}>Basic Info</h2>
                  <button onClick={() => setEditMode(true)} className="text-xs font-medium" style={{ color: '#E07A2F' }}>Edit</button>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Name', value: profile.name || '—' },
                    { label: 'School', value: profile.school || '—' },
                    { label: 'Role', value: profile.identity ? profile.identity.charAt(0).toUpperCase() + profile.identity.slice(1) : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span style={{ color: '#6B6B73' }}>{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected interests summary */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold" style={{ color: '#A0A0A8' }}>Your Interests</h2>
                <button onClick={() => { setTab('interests'); setEditMode(true); }} className="text-xs font-medium" style={{ color: '#E07A2F' }}>Edit</button>
              </div>
              {selectedInterests.length === 0 ? (
                <p className="text-xs" style={{ color: '#6B6B73' }}>No interests selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((key) => (
                    <span key={key} className="badge badge-orange">
                      {getInterestEmoji(key)} {getInterestLabel(key)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interests tab */}
        {tab === 'interests' && (
          <div className="animate-fade-up">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white mb-1">Your Interests</h2>
              <p className="text-xs" style={{ color: '#6B6B73' }}>Select categories and sub-topics that match your skills and what you want to learn.</p>
            </div>
            <InterestTree selected={selectedInterests} onChange={setSelectedInterests} />
            <button
              onClick={saveInterests}
              className="btn-orange w-full py-3 text-sm mt-4"
            >
              Save Interests ({selectedInterests.length})
            </button>
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div className="space-y-2 animate-fade-up">
            {[
              { label: 'Notification Preferences', icon: '🔔', },
              { label: 'Privacy Settings', icon: '🔒', },
              { label: 'Help & Support', icon: '❓', },
              { label: 'Terms of Service', icon: '📄', },
              { label: 'Sign Out', icon: '🚪', danger: true },
            ].map(({ label, icon, danger }) => (
              <button
                key={label}
                className="w-full card card-hover p-4 flex items-center justify-between"
                style={{ color: danger ? '#ef4444' : undefined }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium" style={{ color: danger ? '#ef4444' : '#A0A0A8' }}>{label}</span>
                </div>
                <ChevronRight size={16} style={{ color: '#6B6B73' }} />
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
