import { useEffect, useState } from 'react';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';
import PathCard from '../components/skillpaths/PathCard';

// Services
import skillPathService from '../services/skillPathService';
import progressService from '../services/progressService';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function SkillPathsPage() {
    const { isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('All');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allPathsRes, enrolledRes] = await Promise.all([
                skillPathService.getAll(),
                isAuthenticated ? progressService.getEnrolledPaths().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
            ]);

            const merged = allPathsRes.data.map(path => {
                const enrollment = enrolledRes.data.find(e => e.skillPathId === path.id);
                return {
                    ...path,
                    isEnrolled: !!enrollment,
                    progress: enrollment ? enrollment.progressPercentage : 0
                };
            });
            setPaths(merged);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load skill paths');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    const handleEnroll = async (pathId) => {
        if (!isAuthenticated) {
            toast.error('Please log in to enroll in a skill path');
            return;
        }

        try {
            await progressService.enroll(pathId);
            toast.success('Successfully enrolled!');
            // Refresh data to show "Resume" state
            fetchData();
        } catch (error) {
            toast.error('Enrollment failed. Please try again.');
        }
    };

    const filteredPaths = paths.filter(path => {
        const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDomain = selectedDomain === 'All' || path.domain === selectedDomain;
        return matchesSearch && matchesDomain;
    });

    const domains = ['All', ...new Set(paths.map(p => p.domain).filter(Boolean))];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="skill-paths" />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto lg:pl-72">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Paths</h1>
                            <p className="mt-2 text-slate-500 font-medium max-w-md">
                                Choose a skill path and start your hardware-accelerated, mastery-based learning journey.
                            </p>
                        </div>

                        {/* Search & Filter bar */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Search paths..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full sm:w-64"
                                />
                            </div>

                            <select 
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none min-w-[140px]"
                            >
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : filteredPaths.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredPaths.map((path) => (
                                <PathCard 
                                    key={path.id} 
                                    path={{
                                        ...path,
                                        image: path.imageUrl ? `http://localhost:5000${path.imageUrl}` : `https://api.dicebear.com/7.x/shapes/svg?seed=${path.title}`,
                                        tags: [path.domain || 'General'],
                                        modules: path.totalModules || 0,
                                        levels: path.totalLevels || 0,
                                        hasCertificate: true,
                                        progress: path.progress || 0,
                                        isEnrolled: path.isEnrolled
                                    }} 
                                    onEnroll={handleEnroll}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">No paths found</h2>
                            <p className="text-slate-500 font-medium max-w-sm">We couldn't find any skill paths matching "{searchQuery}". Try a different term or filter.</p>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedDomain('All'); }}
                                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
