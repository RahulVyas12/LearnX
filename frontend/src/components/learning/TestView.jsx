import Logo from '../ui/Logo';

export default function TestView({
    activeTest,
    currentQuestionIdx,
    setCurrentQuestionIdx,
    selectedAnswers,
    setSelectedAnswers,
    timeLeft,
    formatTime,
    handleFinishTest
}) {
    if (!activeTest) return null;

    const questions = activeTest.questions || [];
    const currentQ = questions[currentQuestionIdx];

    return (
        <div className="flex h-screen bg-[#f8fafc] font-['Plus_Jakarta_Sans'] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-6 sm:px-10 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 shrink-0">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <Logo size="md" disableLink />
                        <div>
                            <h2 className="text-sm font-black text-slate-800 tracking-tight leading-tight">{activeTest.title}</h2>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{questions.length} Questions</span>
                                <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pass: 90%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-8 lg:gap-12">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                {Object.keys(selectedAnswers).length}/{questions.length} answered
                            </span>
                            <div className="hidden sm:block w-32 lg:w-48 h-2 bg-slate-100 rounded-full relative overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border border-slate-100">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            <span className="text-base sm:text-lg font-bold text-slate-700 font-mono tracking-tighter">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
                    {/* Question Navigator */}
                    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 flex flex-col h-fit">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Questions</h3>
                        <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestionIdx(idx)}
                                    className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${currentQuestionIdx === idx ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110' : selectedAnswers[idx] !== undefined ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Area */}
                    <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-slate-100 p-6 sm:p-12 flex flex-col relative overflow-hidden">
                        <div className="flex-1">
                            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {questions.length}</span>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-4 sm:mt-6 leading-tight max-w-4xl tracking-tight">
                                {currentQ?.question}
                            </h3>

                            {currentQ?.code && (
                                <pre className="mt-10 p-8 bg-slate-50 rounded-[32px] text-slate-700 font-mono text-sm leading-relaxed border border-slate-100 overflow-x-auto">
                                    <code>{currentQ.code}</code>
                                </pre>
                            )}

                            <div className="mt-12 space-y-4 max-w-4xl">
                                {currentQ?.options.map((opt, idx) => (
                                    <label key={idx} className={`flex items-center p-6 rounded-[28px] border-2 transition-all cursor-pointer group ${selectedAnswers[currentQuestionIdx] === idx ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-50 bg-white hover:border-slate-100'}`}>
                                        <input
                                            type="radio"
                                            name="q"
                                            className="hidden"
                                            checked={selectedAnswers[currentQuestionIdx] === idx}
                                            onChange={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: idx }))}
                                        />
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mr-6 transition-all ${selectedAnswers[currentQuestionIdx] === idx ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-500 group-hover:border-indigo-300'}`}>
                                            {selectedAnswers[currentQuestionIdx] === idx && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span className={`text-[11px] font-black mr-4 ${selectedAnswers[currentQuestionIdx] === idx ? 'text-indigo-600' : 'text-slate-700'}`}>{String.fromCharCode(65 + idx)}.</span>
                                        <span className={`text-sm font-bold ${selectedAnswers[currentQuestionIdx] === idx ? 'text-slate-900' : 'text-slate-700'}`}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 sm:pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                                disabled={currentQuestionIdx === 0}
                                className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors ${currentQuestionIdx === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700 hover:text-indigo-600'}`}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
                                Previous
                            </button>

                            {currentQuestionIdx === questions.length - 1 ? (
                                <button
                                    onClick={handleFinishTest}
                                    className="w-full sm:w-auto px-12 py-4 bg-emerald-500 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                                >
                                    Finish Test
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 13l4 4L19 7" /></svg>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIdx(Math.min(questions.length - 1, currentQuestionIdx + 1))}
                                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                                >
                                    Next
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M9 5l7 7-7 7" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
