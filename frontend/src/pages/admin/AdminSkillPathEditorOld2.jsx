import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminSkillPathEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [skillPath, setSkillPath] = useState(null);
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLevelForm, setShowLevelForm] = useState(false);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    // Form states
    const [levelForm, setLevelForm] = useState({
        title: '',
        tier: 'beginner',
        orderIndex: 0,
        masteryThreshold: 0.90
    });

    const [moduleForm, setModuleForm] = useState({
        title: '',
        contentMarkdown: '',
        orderIndex: 0
    });

    useEffect(() => {
        fetchSkillPath();
    }, [id]);

    useEffect(() => {
        if (selectedLevel) {
            fetchModules(selectedLevel.id);
        }
    }, [selectedLevel]);

    const fetchSkillPath = async () => {
        try {
            const [pathRes, levelsRes] = await Promise.all([
                adminService.getSkillPathById(id),
                adminService.getLevels(id)
            ]);
            setSkillPath(pathRes.data);
            setLevels(levelsRes.data);
            if (levelsRes.data.length > 0) {
                setSelectedLevel(levelsRes.data[0]);
            }
        } catch (error) {
            toast.error('Failed to load skill path');
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async (levelId) => {
        try {
            const response = await adminService.getModules(levelId);
            setModules(response.data);
        } catch (error) {
            toast.error('Failed to load modules');
        }
    };

    const handleCreateLevel = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...levelForm,
                skillPathId: id,
                orderIndex: levels.length
            };
            await adminService.createLevel(payload);
            toast.success('Level created successfully');
            setShowLevelForm(false);
            setLevelForm({ title: '', tier: 'beginner', orderIndex: 0, masteryThreshold: 0.90 });
            fetchSkillPath();
        } catch (error) {
            toast.error('Failed to create level');
        }
    };

    const handleDeleteLevel = async (levelId) => {
        if (!window.confirm('Are you sure you want to delete this level? All modules will be lost.')) return;
        try {
            await adminService.deleteLevel(levelId);
            toast.success('Level deleted successfully');
            if (selectedLevel?.id === levelId) {
                setSelectedLevel(null);
                setModules([]);
            }
            fetchSkillPath();
        } catch (error) {
            toast.error('Failed to delete level');
        }
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...moduleForm,
                levelId: selectedLevel.id,
                orderIndex: modules.length
            };
            await adminService.createModule(payload);
            toast.success('Module created successfully');
            setShowModuleForm(false);
            setModuleForm({ title: '', contentMarkdown: '', orderIndex: 0 });
            setSelectedModule(null);
            fetchModules(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to create module');
        }
    };

    const handleEditModule = (module) => {
        setSelectedModule(module);
        setModuleForm({
            title: module.title,
            contentMarkdown: module.contentMarkdown,
            orderIndex: module.orderIndex
        });
        setShowModuleForm(true);
    };

    const handleUpdateModule = async (e) => {
        e.preventDefault();
        if (!selectedModule) return;
        
        try {
            await adminService.updateModule(selectedModule.id, moduleForm);
            toast.success('Module updated successfully');
            setShowModuleForm(false);
            setSelectedModule(null);
            setModuleForm({ title: '', contentMarkdown: '', orderIndex: 0 });
            fetchModules(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to update module');
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Are you sure you want to delete this module?')) return;
        try {
            await adminService.deleteModule(moduleId);
            toast.success('Module deleted successfully');
            if (selectedModule?.id === moduleId) {
                setSelectedModule(null);
                setShowModuleForm(false);
            }
            fetchModules(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to delete module');
        }
    };

    const handleModuleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(modules);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update orderIndex for all modules
        const updatedModules = items.map((module, index) => ({
            ...module,
            orderIndex: index
        }));

        setModules(updatedModules);

        // TODO: Update order in backend
        toast.info('Module order updated');
    };

    const getReadTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">{skillPath?.title}</h1>
                        <p className="text-slate-500 text-sm mt-1">Skill Path Editor</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowQuestions(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
                        >
                            Manage Tests
                        </button>
                        <button
                            onClick={() => navigate('/admin/skill-paths')}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                        >
                            Back to Paths
                        </button>
                    </div>
                </div>
            </div>

            {/* LEFT PANEL - Level Navigator */}
            <div className="w-80 bg-white border-r border-slate-200 pt-24 pb-6 overflow-y-auto">
                <div className="px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-slate-900">Levels</h2>
                        <button
                            onClick={() => setShowLevelForm(true)}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {levels.map((level) => (
                            <div
                                key={level.id}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedLevel?.id === level.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setSelectedLevel(level)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{level.title}</h3>
                                        <p className="text-sm text-slate-500 capitalize">{level.tier}</p>
                                        <p className="text-xs text-slate-400 mt-1">{level.totalModules || 0} modules</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLevel(level.id);
                                        }}
                                        className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level Form Modal */}
                {showLevelForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Create New Level</h3>
                            <form onSubmit={handleCreateLevel} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={levelForm.title}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tier</label>
                                    <select
                                        value={levelForm.tier}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, tier: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mastery Threshold</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={levelForm.masteryThreshold}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, masteryThreshold: parseFloat(e.target.value) }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowLevelForm(false)}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Create Level
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* CENTER PANEL - Module Manager */}
            <div className="flex-1 bg-white pt-24 pb-6 overflow-y-auto">
                <div className="px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-slate-900">
                            {selectedLevel ? `${selectedLevel.title} - Modules` : 'Select a Level'}
                        </h2>
                        {selectedLevel && (
                            <button
                                onClick={() => {
                                    setSelectedModule(null);
                                    setModuleForm({ title: '', contentMarkdown: '', orderIndex: 0 });
                                    setShowModuleForm(true);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Add Module
                            </button>
                        )}
                    </div>

                    {selectedLevel ? (
                        <DragDropContext onDragEnd={handleModuleDragEnd}>
                            <Droppable droppableId="modules">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {modules.map((module, index) => (
                                            <Draggable key={module.id} draggableId={module.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-4 rounded-xl border-2 transition-all ${
                                                            snapshot.isDragging ? 'border-indigo-500 shadow-lg' : 'border-slate-200'
                                                        } ${selectedModule?.id === module.id ? 'bg-indigo-50' : 'bg-white'}`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-slate-100 rounded cursor-move">
                                                                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-slate-900">{module.title}</h3>
                                                                        <p className="text-sm text-slate-500">
                                                                            {getReadTime(module.contentMarkdown || '')} min read
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditModule(module)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteModule(module.id)}
                                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>Select a level to view and manage its modules</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL - Module Content Editor */}
            <div className="w-96 bg-white border-l border-slate-200 pt-24 pb-6 overflow-y-auto">
                {showModuleForm ? (
                    <div className="px-6">
                        <h2 className="text-lg font-black text-slate-900 mb-6">
                            {selectedModule ? 'Edit Module' : 'Create Module'}
                        </h2>
                        <form onSubmit={selectedModule ? handleUpdateModule : handleCreateModule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Module Title</label>
                                <input
                                    type="text"
                                    required
                                    value={moduleForm.title}
                                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Content (Markdown)</label>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <MDEditor
                                        value={moduleForm.contentMarkdown}
                                        onChange={(value) => setModuleForm(prev => ({ ...prev, contentMarkdown: value || '' }))}
                                        height={400}
                                        preview="edit"
                                        hideToolbar={false}
                                        visibleDragBar={false}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModuleForm(false);
                                        setSelectedModule(null);
                                        setModuleForm({ title: '', contentMarkdown: '', orderIndex: 0 });
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                >
                                    {selectedModule ? 'Update Module' : 'Create Module'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="px-6">
                        <h2 className="text-lg font-black text-slate-900 mb-6">Module Preview</h2>
                        <div className="text-center py-12 text-slate-500">
                            <p>Select a module to edit or create a new one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Questions Modal */}
            {showQuestions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800">Question Manager</h3>
                                <button
                                    onClick={() => setShowQuestions(false)}
                                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-6">
                            <p className="text-center text-slate-500">Question management interface coming soon...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSkillPathEditor;
