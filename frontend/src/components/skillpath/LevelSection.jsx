import ModuleCard from './ModuleCard';

const TIER_COLORS = {
    beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-200', num: 'bg-emerald-500' },
    intermediate: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400',   ring: 'ring-amber-200',   num: 'bg-amber-500' },
    advanced:     { bg: 'bg-rose-100',     text: 'text-rose-700',    dot: 'bg-rose-400',    ring: 'ring-rose-200',    num: 'bg-rose-500' },
};

export default function LevelSection({ level, index, onStartModule, onReviewModule, onTakeMasteryTest }) {
    const isLocked = level.status === 'locked';
    const isCompleted = level.status === 'completed';
    const tier = level.tier || 'beginner';
    const colors = TIER_COLORS[tier] || TIER_COLORS.beginner;

    const completedCount = level.modules.filter(m => m.isCompleted).length;
    const totalModules = level.modules.length;
    const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return (
        <div className={`transition-all duration-300 ${isLocked ? 'opacity-60' : ''}`}>
            {/* Level Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm ring-4 ring-offset-2 ring-white ${
                    isLocked ? 'bg-slate-200 text-slate-400' :
                    isCompleted ? 'bg-emerald-500 text-white shadow-emerald-200' :
                    `${colors.num} text-white shadow-md`
                }`}>
                    {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className={`text-xl font-black tracking-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                            {level.title}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            isLocked ? 'bg-slate-100 text-slate-400' :
                            isCompleted ? 'bg-emerald-100 text-emerald-700' :
                            `${colors.bg} ${colors.text}`
                        }`}>
                            {isCompleted ? '✓ Completed' : tier}
                        </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                        {level.description || `Master the ${tier} concepts`}
                    </p>

                    {/* Progress bar */}
                    {!isLocked && (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                                    style={{ width: `${isCompleted ? 100 : progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 shrink-0">
                                {isCompleted ? totalModules : completedCount}/{totalModules}
                            </span>
                        </div>
                    )}
                </div>

                {isLocked && (
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 15V17M6 21H18A2 2 0 0020 19V13A2 2 0 0018 11H6A2 2 0 004 13V19A2 2 0 006 21ZM16 11V7A4 4 0 008 7V11H8Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Locked
                    </div>
                )}
            </div>

            {/* Modules */}
            <div className="ml-16 space-y-3">
                {level.modules.map((mod, mIdx) => (
                    <ModuleCard
                        key={mod.id || mIdx}
                        mod={mod}
                        index={mIdx}
                        levelStatus={level.status}
                        onStart={onStartModule}
                        onReview={onReviewModule}
                    />
                ))}

                {/* Mastery Test Card */}
                {level.masteryTest && (
                    <div className={`mt-6 p-5 rounded-2xl border-2 transition-all ${
                        isLocked
                            ? 'border-dashed border-slate-100 bg-slate-50/50'
                            : isCompleted
                            ? 'border-emerald-200 bg-emerald-50/30'
                            : 'border-dashed border-amber-200 bg-gradient-to-br from-amber-50/40 to-orange-50/30 shadow-sm shadow-amber-100'
                    }`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                    isLocked ? 'bg-slate-100 text-slate-300' :
                                    isCompleted ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-amber-100 text-amber-600'
                                }`}>
                                    {isCompleted ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isLocked ? 'text-slate-300' : isCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        Level Mastery Test
                                    </p>
                                    <h4 className={`text-base font-black ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                        {level.masteryTest.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {isCompleted ? 'Passed ✓' : `Score ${level.masteryTest.score || 80}% to unlock next level`}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => !isLocked && onTakeMasteryTest(level.masteryTest)}
                                disabled={isLocked}
                                className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shrink-0 ${
                                    isLocked
                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        : isCompleted
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isLocked ? '🔒 Locked' : isCompleted ? '✓ Retake Test' : 'Take Mastery Test'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
