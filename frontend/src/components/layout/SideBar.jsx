// =============================================================
//  SideBar.jsx
//  Fixed left navigation panel.
//  On desktop: always visible (256 px wide).
//  On mobile:  slides in/out via the isOpen prop.
// =============================================================

import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';

// =============================================================
//  NAV ITEMS
//  Each entry maps to one clickable row in the sidebar.
//  `to`      → the React Router path
//  `key`     → matched against the `activePage` prop
//  `label`   → display text
//  `icon`    → which SVG to render (handled by NavIcon below)
// =============================================================

const MAIN_NAV = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { key: 'skill-paths', label: 'Skill Paths', to: '/skill-paths', icon: 'skill-paths' },
  { key: 'practice-tests', label: 'Practice Tests', to: '/practice-tests', icon: 'practice-tests' },
  // { key: 'progress', label: 'Progress', to: '/progress-reports', icon: 'progress' },
  { key: 'certificates', label: 'Certificates', to: '/certificates', icon: 'certificates' },
  { key: 'announcements', label: 'Announcements', to: '/announcements', icon: 'announcements' },
  { key: 'profile', label: 'Profile', to: '/profile', icon: 'profile' },
];

const BOTTOM_NAV = [
  // { key: 'settings', label: 'Settings', to: '/settings', icon: 'settings' },
  { key: 'logout', label: 'Logout', to: '/', icon: 'logout' },
];

// =============================================================
//  COMPONENT
// =============================================================

const SideBar = ({ isOpen, setIsOpen, activePage = 'dashboard' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-100 bg-white transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >

      {/* ── Logo header ── */}
      <div className="flex items-center justify-between px-6 py-6 mb-2">
        <div className="-ml-1 flex items-center">
          <Logo size="md" to="/dashboard" />
        </div>

        {/* Close X (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors lg:hidden"
        >
          {/* X icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Main navigation links ── */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-2">
        <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Main Menu</div>
        <ul className="space-y-1">
          {MAIN_NAV.map((item) => (
            <li key={item.key}>
              <NavItem item={item} isActive={activePage === item.key} />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bottom: Settings + Logout ── */}
      <div className="border-t border-slate-100/60 px-4 py-5">
        <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Account</div>
        <ul className="space-y-1">
          {BOTTOM_NAV.map((item) => (
            <li key={item.key}>
              {item.key === 'logout' ? (
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 ease-out text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:translate-x-1"
                >
                  <div className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:text-indigo-500">
                    <NavIcon name={item.icon} isActive={false} />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                  <svg className="ml-auto w-4 h-4 text-slate-300 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <NavItem item={item} isActive={activePage === item.key} />
              )}
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
};

// =============================================================
//  NAV ITEM
//  A single clickable row — highlighted when active.
// =============================================================

function NavItem({ item, isActive }) {
  const base = 'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 ease-out';

  // Interactive hover states with transform translations
  const idle = 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:translate-x-1';

  // Active state styling: distinct color, subtle gradient background, left accent block
  const active = 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-white hover:translate-x-1';

  return (
    <Link to={item.to} className={`${base} ${isActive ? active : idle}`}>
      {/* Absolute left accent bar for active item */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-lg bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
      )}

      {/* Icon Wrapper allows icon to scale independently on hover */}
      <div className={`transition-transform duration-300 ease-out ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-indigo-500'}`}>
        <NavIcon name={item.icon} isActive={isActive} />
      </div>

      <span className="tracking-tight">{item.label}</span>

      {/* Subtle interaction affordance arrow completely hidden unless hovered */}
      {!isActive && (
        <svg className="ml-auto w-4 h-4 text-slate-300 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}

// =============================================================
//  NAV ICON
//  Returns the correct SVG for each nav item.
//  Active icons are drawn in indigo; idle icons in slate-400.
// =============================================================

function NavIcon({ name, isActive }) {
  // Rather than hardcoded `#4f46e5`, setting colors via class inheritance fits the group-hover setup better,
  // but since SVG stroke is explicitly defined, we will adjust this logic.
  const color = isActive ? '#4338ca' : 'currentColor';
  const props = {
    width: '18', height: '18',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '2.2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    // Four squares (app grid)
    'dashboard': (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    // Open book
    'skill-paths': (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    // Science flask / beaker
    'practice-tests': (
      <svg {...props}>
        <path d="M9 3h6M9 3v7.5L5.5 17A2 2 0 007.3 20h9.4a2 2 0 001.8-3L15 10.5V3" />
      </svg>
    ),
    // // Trending up arrow
    // 'progress': (
    //   <svg {...props}>
    //     <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    //     <polyline points="16 7 22 7 22 13" />
    //   </svg>
    // ),
    // Ribbon / award
    'certificates': (
      <svg {...props}>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      </svg>
    ),
    // Megaphone
    'announcements': (
      <svg {...props}>
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    // User silhouette
    'profile': (
      <svg {...props}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    // // Gear / cog
    // 'settings': (
    //   <svg {...props}>
    //     <circle cx="12" cy="12" r="3" />
    //     <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    //   </svg>
    // ),
    // Arrow right out of box (logout)
    'logout': (
      <svg {...props}>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

export default SideBar;
