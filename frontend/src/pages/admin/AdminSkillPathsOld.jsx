import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminSkillPaths = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDomain, setNewDomain] = useState('');
    const [newStatus, setNewStatus] = useState('Draft');

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

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await adminService.createSkillPath({
                title: newTitle,
                domain: newDomain,
                description: '',
                isPublished: newStatus === 'Published'
            });
            toast.success(`Path "${newTitle}" created successfully!`);
            setIsCreateOpen(false);
            setNewTitle('');
            setNewDomain('');
            fetchPaths();
        } catch (error) {
            toast.error('Failed to create skill path');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this path? All associated levels and modules will be lost.')) return;
        try {
            await adminService.deleteSkillPath(id);
            toast.success('Skill Path deleted');
            fetchPaths();
        } catch (error) {
            toast.error('Failed to delete skill path');
        }
    };

    const handleTogglePublish = async (path) => {
        try {
            await adminService.updateSkillPath(path.id, {
                ...path,
                isPublished: !path.isPublished
            });
            toast.success(`Path ${path.isPublished ? 'un-published' : 'published'}`);
            fetchPaths();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skill Path Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Design curricula, manage modules, and control visibility.</p>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Create Roadmap
                </button>
            </div>

            {/* List View */}
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Path Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paths.map((path) => (
                                    <tr key={path.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{path.title}</div>
                                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">ID: {path.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-[11px] font-black bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
                                                {path.domain || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleTogglePublish(path)}
                                                className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider transition-colors ${path.isPublished ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                                            >
                                                {path.isPublished ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => navigate(`/admin/skill-paths/${path.id}`)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Curriculum"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(path.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete Path"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paths.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No skill paths found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Path Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">New Syllabus Roadmap</h3>
                            <p className="text-sm text-slate-500 font-medium">Initialize a new learning curriculum.</p>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Path Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Master React 18"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Domain / Category</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newDomain}
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Visibility</label>
                                <select 
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                >
                                    <option value="Draft">Draft (Private)</option>
                                    <option value="Published">Published (Live)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">Generate Path</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSkillPaths;
