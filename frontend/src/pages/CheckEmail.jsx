import { Link, useLocation } from 'react-router';
import Logo from '../components/ui/Logo';

const CheckEmail = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email';

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/50 rounded-full -ml-16 -mb-16 blur-2xl" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6">
                        <Logo size="lg" disableLink />
                    </div>

                    {/* Verification Icon */}
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
                    <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed px-4">
                        We've sent password reset instructions to <br />
                        <span className="font-bold text-slate-900 break-all">{email}</span>
                    </p>

                    <div className="mt-8 flex flex-col w-full gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                        >
                            Open email app
                        </button>
                        <Link
                            to="/login"
                            className="h-12 w-full flex items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
                        >
                            Back to Login
                        </Link>
                    </div>

                    <p className="mt-6 text-xs font-semibold text-slate-400">
                        Didn't receive the email?{' '}
                        <button className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4">Click to resend</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckEmail;
