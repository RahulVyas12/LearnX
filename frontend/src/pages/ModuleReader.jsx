import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import skillPathService from '../services/skillPathService';
import progressService from '../services/progressService';

const ModuleReader = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [module, setModule] = useState(null);
    const [level, setLevel] = useState(null);
    const [skillPath, setSkillPath] = useState(null);
    const [modules, setModules] = useState([]);
    const [readModules, setReadModules] = useState(new Set());
    const [isRead, setIsRead] = useState(false);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        if (moduleId) fetchModuleData();
    }, [moduleId]);

    const fetchModuleData = async () => {
        setLoading(true);
        try {
            const moduleRes = await skillPathService.getModuleDetail(moduleId);
            const moduleData = moduleRes.data;
            setModule(moduleData);
            await fetchRelatedData(moduleData.levelId);
        } catch {
            toast.error('Failed to load module');
            setLoading(false);
        }
    };

    const fetchRelatedData = async (levelId) => {
        try {
            const [levelRes, modulesRes] = await Promise.all([
                skillPathService.getLevels(levelId),
                skillPathService.getModules(levelId)
            ]);
            setLevel(levelRes.data);
            setModules(modulesRes.data);
            const spRes = await skillPathService.getById(levelRes.data.skillPathId);
            setSkillPath(spRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async () => {
        if (!user || isRead || marking) return;
        setMarking(true);
        try {
            await progressService.markModuleAsRead(moduleId);
            setIsRead(true);
            setReadModules(prev => new Set([...prev, moduleId]));
            toast.success('Module completed! ✓');
        } catch {
            toast.error('Failed to mark as read');
        } finally {
            setMarking(false);
        }
    };

    const currentIndex = modules.findIndex(m => m.id === moduleId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < modules.length - 1;
    const isLastModule = currentIndex === modules.length - 1;
    const allModulesRead = modules.length > 0 && modules.every(m => readModules.has(m.id) || (m.id === moduleId && isRead));
    const showMasteryTest = isLastModule && allModulesRead;

    const goToModule = (dir) => {
        const idx = dir === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (idx >= 0 && idx < modules.length) navigate(`/module/${modules[idx].id}`);
    };

    const getReadTime = (content) => {
        if (!content) return 1;
        return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
                <p className="text-slate-500 font-medium text-sm">Loading module...</p>
            </div>
        </div>
    );

    if (!module) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Module Not Found</h2>
                <button onClick={() => navigate('/skill-paths')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Back to Paths</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Sticky Top Nav */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate(`/skillpath/${skillPath?.id}`)}
                            className="shrink-0 p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold truncate">
                                <span className="truncate">{skillPath?.title}</span>
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                <span className="truncate">{level?.title}</span>
                            </div>
                            <h1 className="text-base font-black text-slate-900 truncate">{module.title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:flex px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {getReadTime(module.contentMarkdown)} min read
                        </span>
                        {isRead && (
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Completed
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Left Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level Modules</p>
                                <h3 className="text-sm font-black text-slate-800 mt-0.5">{level?.title}</h3>
                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-slate-400 font-bold mb-1.5">
                                        <span>{readModules.size + (isRead ? 0 : 0)} / {modules.length} read</span>
                                        <span>{Math.round((readModules.size / Math.max(modules.length, 1)) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(readModules.size / Math.max(modules.length, 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 space-y-1 max-h-[60vh] overflow-y-auto">
                                {modules.map((m, idx) => {
                                    const isCurrent = m.id === moduleId;
                                    const isDone = readModules.has(m.id) || (isCurrent && isRead);
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => navigate(`/module/${m.id}`)}
                                            className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center gap-3 group ${
                                                isCurrent
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : isDone
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-black ${
                                                isCurrent ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {isDone ? (
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                ) : idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : ''}`}>{m.title}</p>
                                                <p className={`text-xs ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>{getReadTime(m.contentMarkdown)} min</p>
                                            </div>
                                            {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Mastery Test Link in Sidebar */}
                            <div className={`mx-3 mb-3 p-3 rounded-xl border-2 border-dashed transition-all ${allModulesRead ? 'border-amber-300 bg-amber-50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${allModulesRead ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-black ${allModulesRead ? 'text-amber-700' : 'text-slate-400'}`}>Mastery Test</p>
                                        <p className="text-[10px] text-slate-400">{allModulesRead ? 'Ready to take!' : 'Read all modules first'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Module header */}
                            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                        level?.tier === 'advanced' ? 'bg-rose-100 text-rose-600' :
                                        level?.tier === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {level?.tier}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-400 font-semibold">Module {currentIndex + 1} of {modules.length}</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{module.title}</h2>
                            </div>

                            {/* Content */}
                            <div className="px-8 py-8 prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-w-none">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="!rounded-xl !text-sm"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        blockquote({ children }) {
                                            return (
                                                <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/50 pl-4 py-2 pr-4 rounded-r-xl my-4 text-indigo-900 not-italic">
                                                    {children}
                                                </blockquote>
                                            );
                                        }
                                    }}
                                >
                                    {module.contentMarkdown}
                                </ReactMarkdown>
                            </div>

                            {/* Mastery Test Banner — shown only on last module when all read */}
                            {showMasteryTest && (
                                <div className="mx-8 mb-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-md shadow-amber-100">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                                                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">🎉 All Modules Complete!</p>
                                                <h3 className="text-lg font-black text-slate-800">{level?.title} Mastery Test</h3>
                                                <p className="text-sm text-slate-500 mt-0.5">Score 80%+ to unlock the next level and prove your mastery.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/skillpath/${skillPath?.id}`)}
                                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-xl shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm whitespace-nowrap"
                                        >
                                            Take Mastery Test →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Nav */}
                            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Prev */}
                                    <button
                                        onClick={() => goToModule('prev')}
                                        disabled={!hasPrev}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                                            hasPrev
                                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                                : 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                        Previous
                                    </button>

                                    {/* Mark as Read */}
                                    {!isRead ? (
                                        <button
                                            onClick={handleMarkAsRead}
                                            disabled={marking}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
                                        >
                                            {marking ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                            Mark as Complete
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-sm border border-emerald-200">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            Completed!
                                        </div>
                                    )}

                                    {/* Next */}
                                    <button
                                        onClick={() => goToModule('next')}
                                        disabled={!hasNext}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                                            hasNext
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                                                : 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ModuleReader;
