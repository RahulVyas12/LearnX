import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Logo from '../components/ui/Logo';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleResetRequest = (e) => {
        e.preventDefault();
        // Mocking reset password request
        navigate('/check-email', { state: { email } });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="relative z-10">
                    <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mb-8 group">
                        <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        <div className="mb-6 flex justify-center lg:justify-start">
                            <Logo size="lg" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Forgot password?</h2>
                        <p className="mt-2 text-sm text-slate-500 font-medium">No worries, we'll send you reset instructions.</p>
                    </div>

                    <form onSubmit={handleResetRequest} className="space-y-5">
                        <div className="space-y-1.5 text-left">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
