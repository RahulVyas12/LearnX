import SideBar from '../layout/SideBar';
import TopBar from '../layout/TopBar';

export default function LessonView({
    viewingModule,
    setViewingModule,
    isSidebarOpen,
    setIsSidebarOpen
}) {
    if (!viewingModule) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="skill-paths" />
            <div className="flex-1 flex flex-col overflow-y-auto lg:pl-72">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-8 max-w-4xl mx-auto w-full">
                    <button onClick={() => setViewingModule(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to roadmap
                    </button>
                    <div className="bg-slate-50 rounded-[32px] p-10 border border-slate-100">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">{viewingModule.title}</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            {viewingModule.desc} This module contains detailed educational material, interactive code editors, and self-assessment quizzes to ensure you master the topic.
                        </p>
                        <div className="h-64 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 font-bold italic">
                            [ Interactive Lesson Content Area ]
                        </div>
                        <div className="mt-10 flex justify-end">
                            <button onClick={() => setViewingModule(null)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">
                                Complete Module
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
