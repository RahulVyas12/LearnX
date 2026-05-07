export default function AnnouncementsCard({ announcements }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <path d="M22 3L9.218 10.083M11.698 20.334L7 22V13.5L22 3 2 12.5l5 1.5" />
                </svg>
                Announcements
            </h2>

            <div className="flex flex-col gap-4">
                {announcements.map((item, i) => (
                    <div key={i}>
                        <div className="flex items-start gap-2.5">
                            <span
                                className="mt-1 block h-2 w-2 shrink-0 rounded-full"
                                style={{ background: item.dot }}
                            />
                            <div>
                                <p className="text-xs font-bold text-gray-900">{item.title}</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">{item.body}</p>
                            </div>
                        </div>
                        {i < announcements.length - 1 && <hr className="mt-4 border-gray-100" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
