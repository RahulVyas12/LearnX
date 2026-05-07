export default function ResultView({ testResult, onClose, onRetry, nextLevelName, onNextLevel }) {
    if (!testResult) return null;

    const levelUnlocked = testResult.passed && nextLevelName;

    return (
        <div className="flex h-screen bg-[#f8fafc] font-['Plus_Jakarta_Sans'] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* Header */}
                <div className="h-16 px-10 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs italic">LX</div>
                        <span className="font-extrabold text-slate-800 tracking-tight">LearnX</span>
                    </div>
                    <button onClick={onClose} className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Roadmap
                    </button>
                </div>

                {/* 🎉 Level Unlocked Banner — shown only when next level is unlocked */}
                {levelUnlocked && (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 flex items-center justify-between gap-4 shadow-lg shadow-emerald-200/60 shrink-0">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                🎉
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100 mb-0.5">Level Unlocked!</p>
                                <h3 className="text-white font-black text-lg tracking-tight">
                                    {nextLevelName} is now available
                                </h3>
                                <p className="text-emerald-100 text-[11px] font-bold mt-0.5">
                                    You scored {testResult.score}% — outstanding! Proceed to the next stage.
                                </p>
                            </div>
                        </div>
                        {onNextLevel && (
                            <button
                                onClick={onNextLevel}
                                className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95"
                            >
                                Go to {nextLevelName}
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>
                )}

                <main className="flex-1 p-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">

                    {/* ── Left Card: Score Summary ── */}
                    <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                        {!testResult.isPractice && (
                            <div className={`absolute top-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${testResult.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                {testResult.passed ? 'Test Passed' : 'Test Failed'}
                            </div>
                        )}

                        {/* Score Ring */}
                        <div className="mt-12 relative h-48 w-48 flex items-center justify-center">
                            <svg className="transform -rotate-90 w-full h-full">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={552.9}
                                    strokeDashoffset={552.9 - (552.9 * testResult.score) / 100}
                                    className={testResult.isPractice ? 'text-indigo-500' : (testResult.passed ? 'text-emerald-500' : 'text-red-500')}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-800 leading-none">{testResult.score}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your Score</span>
                            </div>
                        </div>

                        <h2 className="mt-8 text-lg font-extrabold text-slate-800 tracking-tight leading-tight">{testResult.testName}</h2>
                        {!testResult.isPractice && (
                            <p className="text-[11px] font-bold text-slate-400 mt-1">Passing score: 90%</p>
                        )}

                        {/* Correct / Incorrect counts */}
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                            <div className="bg-emerald-50/50 p-4 rounded-2xl flex flex-col items-center border border-emerald-100/30">
                                <span className="text-2xl font-black text-emerald-600">{testResult.correct}</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Correct</span>
                            </div>
                            <div className="bg-red-50/50 p-4 rounded-2xl flex flex-col items-center border border-red-100/30">
                                <span className="text-2xl font-black text-red-600">{testResult.total - testResult.correct}</span>
                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Incorrect</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3 w-full">
                            {levelUnlocked && onNextLevel ? (
                                <>
                                    <button
                                        onClick={onNextLevel}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M9 5l7 7-7 7" /></svg>
                                        Start {nextLevelName}
                                    </button>
                                    <button onClick={onClose} className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-indigo-100 transition-all">
                                        View Roadmap
                                    </button>
                                    <button onClick={onRetry} className="w-full py-3 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-all">
                                        Retry Anyway
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={onRetry} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all">
                                        Retry Test
                                    </button>
                                    <button onClick={onClose} className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-indigo-100 transition-all">
                                        Review Roadmap
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Performance Breakdown ── */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Performance Breakdown</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Correct Answers', value: `${testResult.correct}/${testResult.total}`, pct: (testResult.correct / testResult.total) * 100, color: 'bg-emerald-500' },
                                    { label: 'Incorrect Answers', value: `${testResult.total - testResult.correct}/${testResult.total}`, pct: ((testResult.total - testResult.correct) / testResult.total) * 100, color: 'bg-red-500' },
                                    { label: 'Score Efficiency', value: `${testResult.score}/100`, pct: testResult.score, color: 'bg-indigo-500' },
                                ].map(({ label, value, pct, color }) => (
                                    <div key={label}>
                                        <div className="flex justify-between mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <span>{label}</span>
                                            <span className="text-slate-900">{value}</span>
                                        </div>
                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Score Analysis */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Score Analysis</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
                                    <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Accuracy Rate</h4>
                                    <div className="text-right">
                                        <span className="text-sm font-black text-amber-900">{testResult.score}%</span>
                                        <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mt-0.5">
                                            {testResult.isPractice 
                                                ? (testResult.score >= 70 ? 'Excellent' : 'Good effort') 
                                                : (testResult.passed ? 'Excellent' : 'Good effort')}
                                        </p>
                                    </div>
                                </div>
                                {!testResult.isPractice && (
                                    <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100/50 rounded-2xl">
                                        <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest">Required to Pass</h4>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-red-900">90%</span>
                                            <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest mt-0.5">
                                                {testResult.passed ? 'Met ✓' : `Need ${90 - testResult.score}% more`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Next Level Unlocked info card */}
                                {levelUnlocked && (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl">
                                        <div>
                                            <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Next Level Unlocked</h4>
                                            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{nextLevelName}</p>
                                        </div>
                                        <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
