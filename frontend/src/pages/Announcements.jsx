import { useEffect, useState } from 'react';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';
import announcementService from '../services/announcementService';
import { format } from 'date-fns';

// ── Tag colour maps ────────────────────────────────────────────
const TAG_STYLES = {
  general: { border: '#3b82f6', badge: 'bg-blue-50 text-blue-600', icon: 'bg-blue-50 text-blue-500', iconName: 'info' },
  update: { border: '#8b5cf6', badge: 'bg-violet-50 text-violet-600', icon: 'bg-violet-50 text-violet-500', iconName: 'bolt' },
  feature: { border: '#22c55e', badge: 'bg-green-50 text-green-600', icon: 'bg-green-50 text-green-500', iconName: 'star' },
  maintenance: { border: '#f97316', badge: 'bg-orange-50 text-orange-500', icon: 'bg-orange-50 text-orange-400', iconName: 'wrench' },
};

// ── Icons ──────────────────────────────────────────────────────
function AnnouncementIcon({ name, className }) {
  const props = {
    width: '18', height: '18',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    star: (
      <svg {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    wrench: (
      <svg {...props}>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" />
      </svg>
    ),
    bolt: (
      <svg {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    check: (
      <svg {...props}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    info: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  return <span className={className}>{icons[name] ?? icons.info}</span>;
}

// ── Single announcement card ───────────────────────────────────
function AnnouncementCard({ item }) {
  const categoryKey = item.category.toLowerCase();
  const style = TAG_STYLES[categoryKey] ?? TAG_STYLES.general;

  return (
    <div
      className="relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
      style={{ borderColor: style.border, borderWidth: '1px' }}
    >
      <div className="flex items-start gap-5 p-6">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon} transition-transform duration-300 group-hover:scale-110`}>
          <AnnouncementIcon name={style.iconName} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wide ${style.badge}`}>
              {item.category}
            </span>
            <span className="text-[12px] font-semibold text-slate-400">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Announcements() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await announcementService.getAll();
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="announcements" />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto lg:pl-72">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1.5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Announcements</h1>
            </div>
            <p className="text-slate-500 font-medium text-[15px]">
              Platform updates, new features, and important notices.
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <p className="text-slate-400 font-bold">No announcements available at this time.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
