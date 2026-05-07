import ActivityItem from './ActivityItem';

export default function RecentActivityCard({ activities }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    Last 7 days
                </span>
            </div>

            <div className="flex flex-col gap-5">
                {activities.map((item, i) => (
                    <ActivityItem key={i} item={item} />
                ))}
            </div>
        </div>
    );
}
