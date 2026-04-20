// =============================================================
//  Navbar.jsx — Public landing page top navigation bar
//  Sticky header with logo, anchor links, and Login/Register CTAs.
//  Collapses into a hamburger menu on mobile.
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';

const NAV_LINKS = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Skill Paths', href: '#skill-paths' },
    { label: 'Certificates', href: '#certificates' },
];

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // Don't render auth-dependent items while verifying session
    if (loading) return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 h-16 animate-pulse" />
    );

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Logo size="md" />

                    {/* Desktop nav links */}
                    <div className="hidden items-center gap-8 md:flex">
                        {NAV_LINKS.map((link) => (
                            <a key={link.label} href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA buttons */}
                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link 
                                    to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
                                    className="hidden lg:flex items-center gap-3 group"
                                >
                                    <div className="flex flex-col items-end leading-tight">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                                            Welcome back,
                                        </span>
                                        <span className="text-[13px] font-bold text-slate-900 capitalize">
                                            {user.name.split(' ')[0]}
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-[13px] font-black text-white shadow-lg shadow-violet-200 transition-transform group-hover:scale-105 group-active:scale-95 overflow-hidden border-2 border-white ring-1 ring-slate-100">
                                        {user.avatarUrl ? (
                                            <img src={`http://localhost:5000${user.avatarUrl}`} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                </Link>

                                <div className="h-4 w-px bg-slate-200 hidden lg:block" />

                                <Link 
                                    to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
                                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-primary hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={logout}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors p-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg active:scale-95">
                                    Join LearnX →
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>

                {/* Mobile dropdown menu */}
                {menuOpen && (
                    <div className="space-y-2 border-t border-slate-100 py-4 md:hidden">
                        {NAV_LINKS.map((link) => (
                            <a key={link.label} href={link.href} className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary">
                                {link.label}
                            </a>
                        ))}
                        <div className="px-4 pt-2">
                            {user ? (
                                <div className="space-y-4 px-1">
                                    <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-[13px] font-black text-white overflow-hidden shadow-md">
                                            {user.avatarUrl ? (
                                                <img src={`http://localhost:5000${user.avatarUrl}`} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Account</p>
                                            <p className="text-sm font-bold text-slate-900 capitalize">{user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Link 
                                            to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
                                            onClick={() => setMenuOpen(false)}
                                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
                                        >
                                            Go to Dashboard
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-500 transition-colors"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link to="/login" className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                                        Login
                                    </Link>
                                    <Link to="/register" className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition-all hover:bg-violet-700">
                                        Join for Free
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
