export default function ModuleCard({ mod, levelStatus, onStart, onReview }) {
    return (
        <div className="p-5 rounded-[28px] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex items-center gap-5 group">
            <div className={`h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center ${mod.color === 'green' ? 'bg-emerald-50 text-emerald-500' : mod.color === 'blue' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'}`}>
                {mod.status === 'Completed' || mod.status === 'Passed' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : mod.type === 'test' ? (
                    <div className="h-2 w-2 rounded-full border-2 border-current"></div>
                ) : (
                    <div className={`h-2.5 w-2.5 rounded-full ${mod.status === 'In Progress' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`}></div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-[15px] font-bold text-slate-800 truncate tracking-tight">{mod.title}</h4>
                    {mod.status && (
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider ${mod.color === 'green' ? 'bg-emerald-100 text-emerald-600' : mod.color === 'blue' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-50 text-blue-500'}`}>
                            {mod.status}
                        </span>
                    )}
                </div>
                <p className="text-[11px] font-bold text-slate-400 truncate">{mod.desc}</p>
                {mod.topics && (
                    <div className="flex gap-2 mt-2">
                        {mod.topics.map(t => (
                            <span key={t} className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase leading-none">#{t}</span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-6 pr-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 8v4l3 2" /></svg>
                    {mod.duration}
                </div>
                {levelStatus !== 'locked' && (
                    <>
                        {mod.status === 'Completed' ? (
                            <button onClick={() => onReview(mod)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 flex items-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Review
                            </button>
                        ) : mod.status === 'Passed' ? (
                            <div className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 pr-2">
                                Passed <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        ) : mod.status === 'In Progress' ? (
                            <button onClick={() => onStart(mod)} className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2">
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={() => onStart(mod)}
                                className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2"
                            >
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Start
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
