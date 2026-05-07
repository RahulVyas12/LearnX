export default function UpcomingTestsCard({ tests }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                <span className="text-amber-400">⚡</span> Upcoming Tests
            </h2>

            <div className="flex flex-col gap-4">
                {tests.map((test, i) => (
                    <div key={i}>
                        <p className="text-sm font-bold text-gray-900">{test.title}</p>
                        <p className="mb-2 mt-0.5 text-xs text-gray-400">{test.path}</p>
                        <div className="flex items-center gap-2">
                            <span
                                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                                style={{ background: `${test.tagColor}20`, color: test.tagColor }}
                            >
                                {test.tag}
                            </span>
                            <span className="text-xs text-gray-400">{test.when}</span>
                        </div>
                        {i < tests.length - 1 && <hr className="mt-4 border-gray-100" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
