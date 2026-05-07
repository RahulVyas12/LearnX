import CircularRing from './CircularRing';

export default function OverallProgressCard({ completed, total }) {
    const pct = Math.round((completed / total) * 100);

    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-600">Overall Progress</p>
            <CircularRing pct={pct} />
            <p className="mt-4 text-sm font-semibold text-gray-700">{completed} of {total} modules</p>
            <p className="mt-1 text-xs text-gray-400">Keep going! You're doing great.</p>
        </div>
    );
}
