// =============================================================
//  Hero.jsx — Landing page hero section
//  Two-column layout: headline + CTA buttons (left), image (right).
// =============================================================

import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import image1 from '../../assets/image1.png';

// Small feature highlight labels shown below the headline
const FEATURE_BADGES = [
    'Structured Modules',
    'Score 90% to Advance',
    'Earn Certificates',
];

// Shared checkmark SVG used by feature badges
const CheckIcon = () => (
    <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const Hero = () => {
    const { isAuthenticated } = useAuth();
    return (
        <section className="relative overflow-hidden bg-white py-10 lg:py-14">
            {/* Subtle background grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* ── Left: text content ── */}
                    <div>
                        {/* "Free Mastery-Based" badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-primary">
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Free Mastery-Based Learning Platform
                        </div>

                        {/* Headline */}
                        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-5xl">
                            Master Skills.<br />
                            <span className="text-primary">Unlock Careers.</span>
                        </h1>

                        <p className="mb-6 max-w-md text-sm font-medium leading-relaxed text-slate-500">
                            A mastery-based learning platform built for students to validate skills through rigorous testing.
                        </p>


                        {/* Feature badges */}
                        <div className="mb-8 flex flex-wrap gap-4">
                            {FEATURE_BADGES.map((badge) => (
                                <span key={badge} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                    <CheckIcon />
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="mb-10 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={isAuthenticated ? "/dashboard" : "/register"}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-violet-300 active:scale-95"
                            >
                                {isAuthenticated ? "Go to Dashboard →" : "Start Mastery Now →"}
                            </Link>
                            <a
                                href="#skill-paths"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                            >
                                View Skill Paths
                            </a>
                        </div>

                        {/* Social proof row */}
                        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Built for CEIT Students
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Mastery-Based Progression
                            </span>
                        </div>
                    </div>

                    {/* ── Right: hero image with floating badges ── */}
                    <div className="relative">
                        {/* "90% Mastery Reached" floating badge */}
                        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xs font-black text-slate-900">90% Mastery Reached</span>
                        </div>

                        {/* "Certificate Earned" floating badge */}
                        <div className="absolute bottom-16 left-4 z-20 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold text-slate-800">Certificate Earned</span>
                        </div>

                        {/* Hero image */}
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-50 to-blue-50 shadow-xl">
                            <img src={image1} alt="LearnX Mastery Learning" className="block h-auto w-full" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
