export default function ModuleCard({ mod, index, levelStatus, onStart, onReview }) {
    const isLocked = levelStatus === 'locked';
    const isCompleted = mod.isCompleted || mod.status === 'Completed';
    const isInProgress = mod.status === 'In Progress';

    return (
        <div className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
            isLocked
                ? 'bg-slate-50 border-slate-100 cursor-not-allowed'
                : isCompleted
                ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200 hover:shadow-sm hover:shadow-emerald-50'
                : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 cursor-pointer'
        }`}>
            {/* Status Icon */}
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black ${
                isLocked ? 'bg-slate-100 text-slate-300' :
                isCompleted ? 'bg-emerald-100 text-emerald-600' :
                isInProgress ? 'bg-indigo-100 text-indigo-600' :
                'bg-slate-100 text-slate-500'
            }`}>
                {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : isInProgress ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                ) : isLocked ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                ) : (
                    <span>{(index ?? 0) + 1}</span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold truncate ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                        {mod.title}
                    </h4>
                    {isCompleted && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full shrink-0">Done</span>
                    )}
                    {isInProgress && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-full shrink-0">In Progress</span>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400 font-semibold">
                        {mod.readTime || mod.duration || '5 min read'}
                    </span>
                    {mod.topics && mod.topics.length > 0 && (
                        <div className="flex gap-1">
                            {mod.topics.slice(0, 3).map(t => (
                                <span key={t} className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded uppercase">#{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action */}
            {!isLocked && (
                <div className="shrink-0">
                    {isCompleted ? (
                        <button
                            onClick={() => onReview(mod)}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            Review
                        </button>
                    ) : isInProgress ? (
                        <button
                            onClick={() => onStart(mod)}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={() => onStart(mod)}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5 group-hover:bg-indigo-600"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            Start
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
