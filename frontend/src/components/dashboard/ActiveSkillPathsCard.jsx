import { useNavigate } from 'react-router';
import SkillPathRow from './SkillPathRow';

export default function ActiveSkillPathsCard({ paths }) {
    const navigate = useNavigate();
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Active Skill Paths</h2>
                <button onClick={() => navigate("/skill-paths")} className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:underline">
                    View All
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col divide-y divide-gray-50">
                {paths.map((path) => (
                    <SkillPathRow
                        key={path.name}
                        path={path}
                        onClick={() => navigate("/skill-paths")}
                    />
                ))}
            </div>
        </div>
    );
}
