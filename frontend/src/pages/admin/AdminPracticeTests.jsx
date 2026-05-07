import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminPracticeTests = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPaths = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllSkillPaths();
            setPaths(response.data);
        } catch (error) {
            toast.error('Failed to load skill paths');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaths();
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">Select a roadmap to manage its module-level assessments and mastery exams.</p>
                </div>
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex py-20 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    </div>
                ) : (
                    paths.map((path) => (
                        <div key={path.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-2.5 py-1 text-[10px] font-black bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
                                        {path.domain || 'General'}
                                    </span>
                                    <span className={`h-2 w-2 rounded-full ${path.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">{path.title}</h3>
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6">Manage all questions, mock tests, and certification exams for this roadmap.</p>
                            </div>
                            
                            <button 
                                onClick={() => navigate(`/admin/skill-paths/${path.id}`)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
                            >
                                Open Question Bank
                            </button>
                        </div>
                    ))
                )}
                {paths.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 font-bold italic">No roadmaps found to manage.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPracticeTests;
