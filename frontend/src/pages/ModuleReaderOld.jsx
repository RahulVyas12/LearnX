import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';
import skillPathService from '../services/skillPathService';
import progressService from '../services/progressService';
import toast from 'react-hot-toast';

export default function ModuleReader() {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [module, setModule] = useState(null);
    const [levelModules, setLevelModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingRead, setMarkingRead] = useState(false);

    useEffect(() => {
        async function fetchContent() {
            setLoading(true);
            try {
                const modRes = await skillPathService.getModuleDetail(moduleId);
                const modData = modRes.data;
                setModule(modData);

                // Fetch level modules for sidebar and navigation
                const levelModRes = await skillPathService.getModulesByLevel(modData.levelId);
                setLevelModules(levelModRes.data.sort((a, b) => a.orderIndex - b.orderIndex));
            } catch (error) {
                console.error('Error fetching module content:', error);
                toast.error('Failed to load module content.');
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [moduleId]);

    const handleMarkRead = async () => {
        setMarkingRead(true);
        try {
            await progressService.markModuleAsRead(moduleId);
            toast.success('Module marked as read!');
            
            // Find next module
            const currentIndex = levelModules.findIndex(m => m.id === moduleId);
            if (currentIndex !== -1 && currentIndex + 1 < levelModules.length) {
                navigate(`/module/${levelModules[currentIndex + 1].id}`);
            } else {
                toast('Level modules completed! Back to Path Detail.');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error marking as read:', error);
            toast.error('Failed to update progress.');
        } finally {
            setMarkingRead(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    if (!module) return null;

    const currentIndex = levelModules.findIndex(m => m.id === moduleId);
    const prevModule = currentIndex > 0 ? levelModules[currentIndex - 1] : null;
    const nextModule = currentIndex < levelModules.length - 1 ? levelModules[currentIndex + 1] : null;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-['Plus_Jakarta_Sans']">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="skill-paths" />

            <div className="flex flex-1 flex-col overflow-y-auto lg:pl-72 relative">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="flex-1 flex flex-col xl:flex-row">
                    {/* Main Content */}
                    <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 max-w-4xl mx-auto w-full">
                        {/* Header Section */}
                        <div className="mb-12">
                            <nav className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
                                <Link to="/skill-paths" className="hover:text-indigo-400 transition-colors">Skill Paths</Link>
                                <span>/</span>
                                <span className="text-indigo-400">{module.levelTitle}</span>
                            </nav>
                            
                            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                                {module.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2.5 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest text-indigo-400">{module.levelTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>5-8 min read</span>
                                </div>
                            </div>
                        </div>

                        {/* Markdown Content */}
                        <div className="prose prose-invert prose-slate max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                            prose-strong:text-indigo-400 prose-strong:font-bold
                            prose-code:text-indigo-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl prose-pre:p-0">
                            
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                className="rounded-2xl !bg-transparent !m-0 !p-6"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {module.contentMarkdown}
                            </ReactMarkdown>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-20 pt-10 border-t border-slate-800 selection:bg-indigo-500/30">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    {prevModule && (
                                        <button 
                                            onClick={() => navigate(`/module/${prevModule.id}`)}
                                            className="flex-1 sm:flex-none px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold border border-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                                            Previous
                                        </button>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handleMarkRead}
                                    disabled={markingRead}
                                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {markingRead ? 'Updating...' : (nextModule ? 'Mark as Read & Next' : 'Finish Module')}
                                    {!markingRead && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* Right Sidebar: Module Checklist */}
                    <aside className="w-full xl:w-80 bg-slate-950/50 border-l border-slate-900 p-8 shrink-0">
                        <div className="sticky top-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                                Level Progress
                            </h3>
                            
                            <div className="space-y-4">
                                {levelModules.map((m, idx) => (
                                    <Link 
                                        key={m.id}
                                        to={`/module/${m.id}`}
                                        className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${m.id === moduleId ? 'bg-indigo-600/10 border-indigo-500/50 text-white' : 'bg-slate-900/40 border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${m.id === moduleId ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600 group-hover:bg-slate-700'}`}>
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-bold line-clamp-1">{m.title}</span>
                                        {m.id === moduleId && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        )}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-linear-to-br from-indigo-600 to-violet-700 rounded-[28px] shadow-xl shadow-indigo-500/10 overflow-hidden relative group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <h4 className="text-white font-black text-sm mb-2 relative z-10 tracking-tight">Level Mastery</h4>
                                <p className="text-indigo-100 text-[11px] font-bold leading-relaxed mb-5 relative z-10 opacity-80">
                                    Complete all lessons to unlock the practice test.
                                </p>
                                <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden relative z-10">
                                    <div 
                                        className="h-full bg-white rounded-full transition-all duration-1000" 
                                        style={{ width: `${(currentIndex + 1) / levelModules.length * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
