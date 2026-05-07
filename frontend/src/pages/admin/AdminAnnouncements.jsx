import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('General');

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAnnouncements();
            setAnnouncements(response.data);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await adminService.createAnnouncement({
                title: newTitle,
                content: newContent,
                category: newCategory
            });
            toast.success('Announcement broadcasted!');
            setIsCreateOpen(false);
            setNewTitle('');
            setNewContent('');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to broadcast');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await adminService.deleteAnnouncement(id);
            toast.success('Announcement removed');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Broadcasts</h1>
                    <p className="text-slate-500 font-medium mt-1">Send system-wide notifications and updates to all students.</p>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    New Announcement
                </button>
            </div>

            {/* List View */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div key={item.id} className="group bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-indigo-500/30 transition-all relative overflow-hidden">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 text-[10px] font-black bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-wider">
                                            {item.category || 'General'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{item.content}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {announcements.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 font-bold italic">The broadcast feed is currently silent.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Compose Broadcast</h3>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Announcement Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. System Maintenance Tomorrow"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                <select 
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-sm uppercase"
                                >
                                    <option>General</option>
                                    <option>Platform Update</option>
                                    <option>New Content</option>
                                    <option>Maintenance</option>
                                    <option>Special Event</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Content</label>
                                <textarea 
                                    required
                                    rows="4"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="Deep dive into the update details..."
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none"
                                ></textarea>
                            </div>
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/60">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">Broadcast Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
