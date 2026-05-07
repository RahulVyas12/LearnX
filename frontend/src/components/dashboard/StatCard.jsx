function StatIcon({ type, color = '#6366f1' }) {
    // If color is hex (starts with #), append 18 for 10% opacity. 
    // Otherwise fallback to a safe indigo tint.
    const bg = color.startsWith('#') ? `${color}18` : '#6366f118';

    const paths = {
        check: (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill={bg} />
                <circle cx="18" cy="18" r="11" stroke={color} strokeWidth="1.5" fill="none" />
                <path d="M13 18l3.5 3.5 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        book: (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill={bg} />
                <path d="M10 13v10a1 1 0 001 1h6V12h-6a1 1 0 00-1 1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M26 13v10a1 1 0 01-1 1h-6V12h6a1 1 0 011 1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        target: (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill={bg} />
                <circle cx="18" cy="18" r="9" stroke={color} strokeWidth="1.5" />
                <circle cx="18" cy="18" r="5" stroke={color} strokeWidth="1.5" />
                <circle cx="18" cy="18" r="1.5" fill={color} />
            </svg>
        ),
        award: (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill={bg} />
                <path d="M18 10a5 5 0 100 10 5 5 0 000-10z" stroke={color} strokeWidth="1.5" />
                <path d="M14 21.5l-1 4.5 5-2 5 2-1-4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    };

    return paths[type] ?? null;
}

export default function StatCard({ card }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <StatIcon type={card.icon} color={card.color} />
            <div>
                <p className="text-2xl font-bold leading-none text-gray-900">{card.value}</p>
                <p className="mt-1.5 text-xs text-gray-400">{card.label}</p>
            </div>
        </div>
    );
}
