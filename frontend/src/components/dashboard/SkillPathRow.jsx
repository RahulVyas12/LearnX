export default function SkillPathRow({ path, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex cursor-pointer items-center gap-3 py-3 transition-colors hover:bg-slate-50/50 rounded-lg px-2 -mx-2"
        >
            <img
                src={path.img || path.image}
                alt={path.name || path.title}
                className="h-9 w-9 shrink-0 rounded-lg object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
            />
            <div
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                style={{ background: path.color || '#6366f1' }}
            >
                {(path.name || path.title)?.[0] || '?'}
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900">{path.name || path.title}</span>
                    <span className="shrink-0 text-xs font-bold text-gray-600">{path.pct ?? path.progress ?? 0}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${path.pct}%`, background: path.color }}
                    />
                </div>

                <p className="mt-1 text-[11px] text-gray-400">{path.modules} modules</p>
            </div>

            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
            </svg>
        </div>
    );
}
