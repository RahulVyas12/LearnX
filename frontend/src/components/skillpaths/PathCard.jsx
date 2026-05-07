import { useNavigate } from 'react-router';

function InfoIcon({ icon, label }) {
    const icons = {
        book: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
        ),
        levels: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        award: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
        )
    };

    return (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <span className="text-slate-300">{icons[icon]}</span>
            <span className="uppercase tracking-wider">{label}</span>
        </div>
    );
}

export default function PathCard({ path, onEnroll }) {
    const navigate = useNavigate();

    const getImageUrl = (skillPath) => {
        if (!skillPath.imageUrl) return null;
        return skillPath.imageUrl.startsWith('http') ? skillPath.imageUrl : `http://localhost:5000${skillPath.imageUrl}`;
    };

    return (
        <div
            onClick={() => navigate(`/skill-path/${path.id}`)}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
        >
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                {getImageUrl(path) ? (
                    <img
                        src={getImageUrl(path)}
                        alt={path.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 ${getImageUrl(path) ? 'hidden' : ''}`}>
                    <div className="text-white text-4xl font-bold">
                        {path.title.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="absolute left-4 top-4 flex gap-2">
                    {path.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-lg"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-col p-6 flex-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {path.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {path.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-5">
                    <InfoIcon icon="book" label={`${path.modules} Modules`} />
                    <InfoIcon icon="levels" label={`${path.levels} Levels`} />
                    {path.hasCertificate && <InfoIcon icon="award" label="Certificate" />}
                </div>

                {path.progress > 0 && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-xs font-bold mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-indigo-600">{path.progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                                style={{ width: `${path.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (path.isEnrolled) {
                            navigate(`/skill-path/${path.id}`);
                        } else {
                            onEnroll && onEnroll(path.id);
                        }
                    }}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white transition-all active:scale-95 shadow-lg ${
                        path.isEnrolled 
                        ? 'bg-slate-900 hover:bg-indigo-600 shadow-slate-900/10' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                    }`}
                >
                    {path.isEnrolled ? (path.progress > 0 ? 'Continue Path' : 'Start Path') : 'Enroll Now'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
