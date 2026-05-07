function ActivityIcon({ type, color }) {
    const icons = {
        completed: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        started: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
                <polygon points="5,3 19,12 5,21" />
            </svg>
        ),
        passed: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        earned: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    };

    return icons[type] ?? null;
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function ActivityItem({ item }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${item.color}18` }}
            >
                <ActivityIcon type={item.type} color={item.color} />
            </div>

            <div>
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">{capitalize(item.type)}</span>{' '}
                    {item.label}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">{item.time}</p>
            </div>
        </div>
    );
}
