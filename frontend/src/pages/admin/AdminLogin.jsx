import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/ui/Logo';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { loginAdmin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await loginAdmin(email, password);
            toast.success('Admin authentication successful');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.message || 'Unauthorized Access');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">

            {/* Ambient background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="mb-3">
                            <Logo size="lg" isDark disableLink />
                        </div>
                        <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Portal</h1>
                        <p className="text-slate-400 text-sm mt-1.5 font-medium">Sign in to manage LearnX platform</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Email</label>
                            <input
                                id="admin-login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@learnx.com"
                                className="w-full h-12 bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <input
                                id="admin-login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full h-12 bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <button
                            id="admin-login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Authenticating...
                                </>
                            ) : (
                                'Verify & Login'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-slate-700/50 pt-5">
                        <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                            Secure Admin Portal
                        </p>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">
                        ← Return to Student Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
