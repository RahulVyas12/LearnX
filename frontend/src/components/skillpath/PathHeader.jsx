export default function PathHeader({ path, onBack }) {
    if (!path) return null;

    return (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <div className="h-[5px] w-full bg-[#4f46e5]"></div>

            <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                        <img src={path.image} alt={path.title} className="h-full w-full object-contain" />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-[-0.03em]">{path.title}</h1>
                            <div className="flex gap-1.5 ml-2">
                                {path.tags && Array.isArray(path.tags) && path.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-slate-500 text-[14px] leading-relaxed mb-6 max-w-3xl font-medium antialiased">
                            {path.description}
                        </p>

                        <div className="flex flex-wrap gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
                                {path.modulesCount} Modules
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                {path.levelsCount} Sequential Phases
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8a7 7 0 100 14 7 7 0 000-14zM8.21 13.89L7 23l5-3 5 3-1.21-9.11" /></svg>
                                Global Certification
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-slate-400">Mastery Progress</span>
                                <span className="text-[#4f46e5] font-bold">{path.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-[#4f46e5] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                    style={{ width: `${path.progress}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-[10px] font-bold text-slate-400 italic">
                                {path.completed} of {path.modulesCount} modules completed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
