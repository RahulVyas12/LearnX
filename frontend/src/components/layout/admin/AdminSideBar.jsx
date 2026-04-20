import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import Logo from '../../ui/Logo';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Overview', to: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { key: 'users', label: 'Students', to: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { key: 'skill-paths', label: 'Skill Paths', to: '/admin/skill-paths', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'practice-tests', label: 'Practice Tests', to: '/admin/practice-tests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { key: 'announcements', label: 'Announcements', to: '/admin/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
];

const AdminSideBar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/50 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* Logo Area */}
            <div className="flex h-20 items-center px-4 border-b border-white/10 shrink-0">
                <Logo size="md" isDark to="/admin/dashboard" />
                <span className="ml-[2px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-[9px] font-black uppercase text-indigo-300 tracking-widest border border-indigo-500/30 -translate-y-2">Admin</span>
                
                {/* Mobile Close Button */}
                <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Management</p>
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.key}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                                isActive 
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                        >
                            <svg className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => { logout(); window.location.href = '/admin/login'; }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout Admin
                </button>
            </div>
        </aside>
    );
};

export default AdminSideBar;
