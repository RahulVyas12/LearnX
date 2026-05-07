// =============================================================
//  Profile.jsx
//  User profile page — matches the supplied design reference.
//  Left: avatar card with info & edit button
//  Right top: Learning Stats (4 counters)
//  Right bottom: Skill Path Progress bars
// =============================================================

import { useState, useRef } from 'react';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';
import { useAuth } from '../hooks/useAuth';
import progressService from '../services/progressService';
import toast from 'react-hot-toast';

const STAT_CONFIG = [
  { key: 'modulesCompleted', label: 'Modules Done', color: '#6366f1', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
  )},
  { key: 'testsPassed', label: 'Tests Passed', color: '#06b6d4', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
  )},
  { key: 'certificatesEarned', label: 'Certificates', color: '#f59e0b', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      </svg>
  )},
  { key: 'activePaths', label: 'Active Paths', color: '#10b981', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
  )},
];

// ── Sub-components ─────────────────────────────────────────────

function ProfileCard({ user, onEdit, onAvatarUpdate }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const avatarUrl = await onAvatarUpdate(formData);
      toast.success('Avatar updated');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-4">

      {/* Avatar circle */}
      <div 
        onClick={handleAvatarClick}
        className="relative group cursor-pointer"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 overflow-hidden text-rose-500 text-2xl font-black tracking-tight select-none shadow-inner border-2 border-white ring-4 ring-slate-50">
          {user.avatarUrl ? (
            <img src={`http://localhost:5000${user.avatarUrl}`} alt="" className="h-full w-full object-cover" />
          ) : (
            user.initials || user.name?.charAt(0)
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*"
        />
      </div>

      {/* Name & role */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h2>
        <p className="mt-0.5 text-sm font-medium text-slate-400">{user.role}</p>
      </div>

      {/* Edit Profile button */}
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit Profile
      </button>

      {/* Divider */}
      <div className="w-full h-px bg-slate-100 my-1" />

      {/* Info rows */}
      <ul className="w-full space-y-3">
        {/* Email */}
        <InfoRow
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
          }
          text={user.email}
        />
        {/* Department */}
        <InfoRow
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 000 20M2 12h20" />
            </svg>
          }
          text={user.department}
        />
        {/* Joined */}
        <InfoRow
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          text={`Joined ${user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}`}
        />
      </ul>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        {icon}
      </span>
      {text}
    </li>
  );
}

function LearningStats({ stats }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-[15px] font-extrabold text-slate-900 mb-5 tracking-tight">Learning Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CONFIG.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition-colors">
            <span style={{ color: s.color }}>{s.icon}</span>
            <span className="text-2xl font-black text-slate-900">{stats ? stats[s.key] : 0}</span>
            <span className="text-[11px] font-semibold text-slate-400 text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillPathProgress({ paths }) {
  if (!paths || paths.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">No Active Paths</h3>
        <p className="text-xs text-slate-400 max-w-[200px]">Enroll in a skill path to start tracking your progress here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-[15px] font-extrabold text-slate-900 mb-5 tracking-tight">Skill Path Progress</h3>
      <div className="space-y-4">
        {paths.map((path) => (
          <div key={path.skillPathId} className="flex items-center gap-4 group">

            {/* Thumbnail */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-indigo-50 flex items-center justify-center text-indigo-500 font-black">
              {path.title.charAt(0)}
            </div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {path.title}
                </span>
                <span
                  className="ml-3 text-[12px] font-extrabold shrink-0 text-indigo-600"
                >
                  {Math.round(path.progressPercentage)}%
                </span>
              </div>

              {/* Progress bar track */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out bg-indigo-600"
                  style={{ width: `${path.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Edit Profile Modal ───────────────────────────────────────
function EditProfileModal({ onClose, user, onSave }) {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Compute new initials from name (up to 2 characters)
    const newInitials = (formData.name || '')
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    onSave({ ...formData, initials: newInitials });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-900">Edit Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Role & Batch</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
            </div>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Profile() {
  const { user, updateProfile, uploadAvatar, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const [statsRes, pathsRes] = await Promise.all([
          progressService.getDashboard(),
          progressService.getEnrolledPaths()
        ]);
        setStats(statsRes.data);
        setEnrolledPaths(pathsRes.data);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoadingContent(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveProfile = async (updatedUser) => {
    try {
      await updateProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        department: updatedUser.department
      });
      setIsEditModalOpen(false);
    } catch (err) {
      // toast handled in context
    }
  };

  const handleAvatarUpdate = async (formData) => {
    return await uploadAvatar(formData);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-bold">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="profile" />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto lg:pl-72">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">

          {/* ── Page title ── */}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">Profile</h1>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

            {/* Left — Profile card */}
            <ProfileCard 
              user={user} 
              onEdit={() => setIsEditModalOpen(true)} 
              onAvatarUpdate={handleAvatarUpdate}
            />

            {/* Right — Stats + Progress stacked */}
            <div className="flex flex-col gap-6">
              {loadingContent ? (
                <div className="space-y-6">
                  <div className="h-40 bg-slate-200 animate-pulse rounded-2xl" />
                  <div className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
                </div>
              ) : (
                <>
                  <LearningStats stats={stats} />
                  <SkillPathProgress paths={enrolledPaths} />
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
