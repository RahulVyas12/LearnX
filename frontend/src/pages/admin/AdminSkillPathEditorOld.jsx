import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import skillPathService from '../../services/skillPathService';
import ReactMarkdown from 'react-markdown';

const AdminSkillPathEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [path, setPath] = useState(null);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
    
    // Form State
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newLevelTitle, setNewLevelTitle] = useState('');
    const [newLevelTier, setNewLevelTier] = useState('Beginner');
    const [uploading, setUploading] = useState(false);
    
    // Content Editor State
    const [isEditContentOpen, setIsEditContentOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const pathRes = await skillPathService.getById(id);
            const levelsRes = await skillPathService.getLevels(id);
            
            const levelsWithModules = await Promise.all(levelsRes.data.map(async (level) => {
                const modulesRes = await skillPathService.getModulesByLevel(level.id);
                return { ...level, modules: modulesRes.data };
            }));

            setPath(pathRes.data);
            setLevels(levelsWithModules);
            if (levelsWithModules.length > 0 && !expandedLevel) {
                setExpandedLevel(levelsWithModules[0].id);
            }
        } catch (error) {
            toast.error('Failed to load roadmap details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddLevel = async (e) => {
        e.preventDefault();
        try {
            await adminService.createLevel({
                skillPathId: id,
                title: newLevelTitle,
                tier: newLevelTier,
                orderIndex: levels.length,
                description: `Master ${newLevelTier} concepts.`,
                masteryThreshold: 0.9
            });
            toast.success(`Level "${newLevelTitle}" added`);
            setNewLevelTitle('');
            setIsAddLevelOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to add level');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await adminService.uploadSkillPathImage(id, formData);
            toast.success('Thumbnail updated');
            fetchData();
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        try {
            const level = levels.find(l => l.id === expandedLevel);
            await adminService.createModule({
                levelId: expandedLevel,
                title: newModuleTitle,
                content: '# New Module Content\nStart writing here...',
                orderIndex: level.modules.length,
                readTime: '10 min'
            });
            toast.success(`Module "${newModuleTitle}" added`);
            setNewModuleTitle('');
            setIsAddModuleOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to add module');
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Remove this module?')) return;
        try {
            await adminService.deleteModule(moduleId);
            toast.success('Module removed');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete module');
        }
    };

    const handleEditContent = (module) => {
        setEditingModule(module);
        setEditedContent(module.content || '');
        setIsEditContentOpen(true);
    };

    const handleSaveContent = async () => {
        try {
            await adminService.updateModule(editingModule.id, {
                ...editingModule,
                content: editedContent
            });
            toast.success('Module content updated');
            setIsEditContentOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to update content');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header & Breadcrumbs */}
            <div>
                <button onClick={() => navigate('/admin/skill-paths')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Skill Paths
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                                {path.imageUrl ? (
                                    <img src={`http://localhost:5000${path.imageUrl}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-slate-900 transition-all">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </label>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{path.title}</h1>
                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${path.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {path.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium mt-1">Syllabus Architecture • {levels.length} Levels</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsAddLevelOpen(true)}
                            className="bg-indigo-600 text-white hover:bg-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add Level
                        </button>
                    </div>
                </div>
            </div>

            {/* Level Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => setExpandedLevel(level.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${expandedLevel === level.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                    >
                        {level.title}
                    </button>
                ))}
            </div>

            {/* Curriculum Builder */}
            {expandedLevel && (
                <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Modules in {levels.find(l => l.id === expandedLevel)?.title}
                        </h2>
                        <button 
                            onClick={() => setIsAddModuleOpen(true)}
                            className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add Module
                        </button>
                    </div>

                    <div className="space-y-3">
                        {levels.find(l => l.id === expandedLevel)?.modules.map((module, index) => (
                            <div key={module.id} className="group flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-500/30 hover:bg-slate-50/50 transition-all">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800">{module.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{module.readTime || '5 min'} reading time</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEditContent(module)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit Content"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/admin/practice-tests/${module.id}`)}
                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                        title="Manage Questions"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteModule(module.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Remove Module"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {levels.find(l => l.id === expandedLevel)?.modules.length === 0 && (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-slate-500 font-medium">This level is currently empty.</p>
                                <button onClick={() => setIsAddModuleOpen(true)} className="mt-2 text-indigo-600 font-bold hover:underline">Add the first module</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Level Modal */}
            {isAddLevelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">Add Path Level</h3>
                        </div>
                        <form onSubmit={handleAddLevel} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newLevelTitle}
                                    onChange={(e) => setNewLevelTitle(e.target.value)}
                                    placeholder="e.g. Advanced Routing"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Tier</label>
                                <select 
                                    value={newLevelTier}
                                    onChange={(e) => setNewLevelTier(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Expert</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => setIsAddLevelOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">Add Level</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Module Modal */}
            {isAddModuleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">Add New Module</h3>
                        </div>
                        <form onSubmit={handleAddModule} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    placeholder="e.g. Advanced State Management"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => setIsAddModuleOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">Add Module</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Module Content Editor Modal (Full Screen-ish) */}
            {isEditContentOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in fade-in duration-200">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsEditContentOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-none">{editingModule?.title}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Markdown Content Editor</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleSaveContent}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Editor Body (Split Pane) */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Input */}
                        <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
                            <textarea 
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="flex-1 w-full p-8 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none resize-none no-scrollbar"
                                placeholder="Write your module content in Markdown..."
                            />
                        </div>

                        {/* Right: Preview */}
                        <div className="flex-1 bg-slate-50 overflow-y-auto p-8 no-scrollbar prose prose-slate max-w-none">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 min-h-full">
                                <ReactMarkdown className="markdown-body">{editedContent || '*No content yet. Start typing on the left to see the preview here.*'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSkillPathEditor;
