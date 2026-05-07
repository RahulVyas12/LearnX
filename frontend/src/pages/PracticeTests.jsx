import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';

// Services
import skillPathService from '../services/skillPathService';

export default function PracticeTests() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPaths() {
            try {
                const response = await skillPathService.getAll();
                setPaths(response.data);
            } catch (error) {
                console.error('Error fetching skill paths:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPaths();
    }, []);

    const handleStartPractice = (id) => {
        navigate(`/practice-test/${id}`);
    };

    const filteredTests = paths.filter(test => {
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || test.domain === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(paths.map(p => p.domain))];

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="practice-tests" />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto lg:pl-72 relative">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 bg-white px-4 pt-6 pb-20 sm:px-6 lg:px-10 lg:pt-8 w-full max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-teal-600">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 3h6M9 3v7.5L5.5 17A2 2 0 007.3 20h9.4a2 2 0 001.8-3L15 10.5V3" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Practice Tests</h1>
                        </div>
                        <p className="text-slate-500 text-lg">
                            Practice mode — results do not affect your mastery progression.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-10 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-4 lg:p-5 flex flex-col lg:flex-row flex-wrap items-center gap-5 transition-all outline-none">
                        <div className="relative flex-1 w-full group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-indigo-600">
                                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search practice tests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 focus:border-indigo-500/30 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-semibold text-slate-700 transition-all outline-none"
                            />
                        </div>
                        <div className="flex flex-row items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1 shrink-0">
                            <div className="flex items-center p-1.5 bg-slate-50/80 border border-slate-100 rounded-2xl shrink-0 shadow-inner">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`relative px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                        </div>
                    ) : filteredTests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No practice tests found</h3>
                            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredTests.map((test) => (
                                <TestCard key={test.id} test={{
                                    ...test,
                                    category: test.domain,
                                    level: 'All Levels',
                                    questionsCount: test.totalModules * 5, // Estimated
                                    duration: '20 mins'
                                }} onStart={() => handleStartPractice(test.id)} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function TestCard({ test, onStart }) {
    return (
        <div className="group bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600">
                    {test.category}
                </span>
                <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full whitespace-nowrap">
                    PRACTICE
                </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem] break-words">
                {test.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 h-10 overflow-hidden text-ellipsis line-clamp-2">
                {test.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 mt-auto text-slate-600 text-xs font-bold">
                <div className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>{test.duration}</span>
                </div>
            </div>
            <button
                onClick={onStart}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-teal-100 active:scale-[0.98]"
            >
                Start Practice
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}
