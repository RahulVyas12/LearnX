// =============================================================
//  TopBar.jsx
//  Sticky top navigation bar shown across all dashboard pages.
//  Contains: mobile menu toggle, search bar, action icons, user info.
// =============================================================

import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';


const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 px-4 sm:px-6 py-3 z-20 flex h-20 border-b w-full items-center justify-between border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm transition-all">

      {/* ── Left Side: Hamburger (mobile) or Logo (desktop) ── */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-3 rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-50 active:scale-95 lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Brand Logo for Mobile */}
        <Logo size="sm" className="lg:hidden" to="/dashboard" />
      </div>

      {/* ── Search bar — hidden on mobile/tablet, shown on lg+ ── */}
      <div className="relative max-w-md flex-1 group hidden lg:block">
        {/* Search icon inside the input */}
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Search modules, tests & paths..."
          className="h-11 w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500/30 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-indigo-500/10 transition-all hover:bg-slate-50 shadow-sm"
        />
      </div>

      {/* ── Right-side actions ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Search icon for mobile (hidden on lg+) */}
        <button className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>

        {/* Dark mode toggle button */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-sm">
          {/* Moon icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Notification bell with red dot */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-sm">
          {/* Bell icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Red notification dot */}
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User avatar + name */}
        <div className="flex cursor-pointer items-center ml-1 sm:ml-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="flex items-center gap-3 px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
            {/* Initials avatar circle */}
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={`http://localhost:5000${user.avatarUrl}`} alt="" className="h-full w-full object-cover" />
              ) : (
                user?.initials || user?.name?.charAt(0) || 'U'
              )}
            </div>
            {/* Name & Role — hidden on small screens */}
            <div className="hidden md:flex flex-col">
              <span className="text-[13px] font-extrabold text-slate-800 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {user?.role || ''}
              </span>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;