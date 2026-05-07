import { useNavigate } from 'react-router';

export default function WelcomeHeader({ name }) {
    const navigate = useNavigate();
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Welcome back, {name}&nbsp;👋
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Continue your learning journey. You're making great progress!
                </p>
            </div>

            <button onClick={() => navigate("/skill-paths")} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 active:scale-95 transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Browse Paths
            </button>
        </div>
    );
}
