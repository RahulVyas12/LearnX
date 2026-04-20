export default function CircularRing({ pct }) {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const filledArc = (pct / 100) * circumference;

    return (
        <svg width="148" height="148" viewBox="0 0 148 148">
            <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>

            {/* Grey background track */}
            <circle cx="74" cy="74" r={radius} fill="none" stroke="#e8eaf6" strokeWidth="11" />

            {/* Coloured progress arc */}
            <circle
                cx="74" cy="74" r={radius}
                fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${filledArc} ${circumference}`}
                transform="rotate(-90 74 74)"
            />

            {/* Centred text */}
            <text x="74" y="69" textAnchor="middle" fontSize="24" fontWeight="800" fill="#1e1b4b">{pct}%</text>
            <text x="74" y="86" textAnchor="middle" fontSize="11" fill="#9ca3af">Complete</text>
        </svg>
    );
}
