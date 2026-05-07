import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import '../styles/scrollbar.css';

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
    const [editingLevel, setEditingLevel] = useState(null);
    
    // Mastery test state
    const [masteryTests, setMasteryTests] = useState({});
    const [showMasteryTestForm, setShowMasteryTestForm] = useState(false);
    const [editingMasteryTest, setEditingMasteryTest] = useState(null);

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

    const [masteryTestForm, setMasteryTestForm] = useState({
        title: 'Mastery Test',
        timeLimitMinutes: null
    });

    useEffect(() => {
        fetchSkillPath();
    }, [id]);

    useEffect(() => {
        if (selectedLevel) {
            fetchModules(selectedLevel.id);
            fetchMasteryTest(selectedLevel.id);
        }
    }, [selectedLevel]);

    const fetchSkillPath = async () => {
        console.log('AdminSkillPathEditor: Loading skill path with ID:', id);
        try {
            const [pathRes, levelsRes] = await Promise.all([
                adminService.getSkillPathById(id),
                adminService.getLevels(id)
            ]);
            console.log('AdminSkillPathEditor: API responses:', pathRes.data, levelsRes.data);
            setSkillPath(pathRes.data);
            setLevels(levelsRes.data);
            if (levelsRes.data.length > 0) {
                setSelectedLevel(levelsRes.data[0]);
            }
        } catch (error) {
            console.error('AdminSkillPathEditor: Error loading skill path:', error);
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

    const fetchMasteryTest = async (levelId) => {
        try {
            const response = await adminService.getMasteryTestByLevel(levelId);
            setMasteryTests(prev => ({
                ...prev,
                [levelId]: response.data
            }));
        } catch (error) {
            // It's okay if no mastery test exists yet
            setMasteryTests(prev => ({
                ...prev,
                [levelId]: null
            }));
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
            resetLevelForm();
            fetchSkillPath();
        } catch (error) {
            toast.error('Failed to create level');
        }
    };

    const handleUpdateLevel = async (e) => {
        e.preventDefault();
        if (!editingLevel) return;
        
        try {
            await adminService.updateLevel(editingLevel.id, levelForm);
            toast.success('Level updated successfully');
            setShowLevelForm(false);
            setEditingLevel(null);
            resetLevelForm();
            fetchSkillPath();
        } catch (error) {
            toast.error('Failed to update level');
        }
    };

    const handleDeleteLevel = async (levelId) => {
        if (!window.confirm('Are you sure you want to delete this level? All modules and questions will be lost.')) return;
        
        try {
            await adminService.deleteLevel(levelId);
            toast.success('Level deleted successfully');
            fetchSkillPath();
            if (selectedLevel?.id === levelId) {
                setSelectedLevel(null);
            }
        } catch (error) {
            toast.error('Failed to delete level');
        }
    };

    const handleEditLevel = (level) => {
        setEditingLevel(level);
        setLevelForm({
            title: level.title,
            tier: level.tier,
            orderIndex: level.orderIndex,
            masteryThreshold: level.masteryThreshold || 0.90
        });
        setShowLevelForm(true);
    };

    const resetLevelForm = () => {
        setLevelForm({
            title: '',
            tier: 'beginner',
            orderIndex: 0,
            masteryThreshold: 0.90
        });
        setEditingLevel(null);
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();
        if (!selectedLevel) return;

        try {
            const payload = {
                ...moduleForm,
                levelId: selectedLevel.id,
                orderIndex: modules.length
            };
            await adminService.createModule(payload);
            toast.success('Module created successfully');
            setShowModuleForm(false);
            resetModuleForm();
            fetchModules(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to create module');
        }
    };

    const handleUpdateModule = async (e) => {
        e.preventDefault();
        if (!selectedModule) return;

        try {
            await adminService.updateModule(selectedModule.id, moduleForm);
            toast.success('Module updated successfully');
            setShowModuleForm(false);
            setSelectedModule(null);
            resetModuleForm();
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
            fetchModules(selectedLevel.id);
            if (selectedModule?.id === moduleId) {
                setSelectedModule(null);
            }
        } catch (error) {
            toast.error('Failed to delete module');
        }
    };

    const handleEditModule = (module) => {
        setSelectedModule(module);
        setModuleForm({
            title: module.title,
            contentMarkdown: module.contentMarkdown || '',
            orderIndex: module.orderIndex
        });
        setShowModuleForm(true);
    };

    const resetModuleForm = () => {
        setModuleForm({
            title: '',
            contentMarkdown: '',
            orderIndex: 0
        });
        setSelectedModule(null);
    };

    const handleModuleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(modules);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedModules = items.map((module, index) => ({
            ...module,
            orderIndex: index
        }));

        setModules(updatedModules);

        // TODO: Update order in backend
        toast.info('Module order updated');
    };

    const moveModule = (moduleId, direction) => {
        const currentIndex = modules.findIndex(m => m.id === moduleId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= modules.length) return;

        const items = [...modules];
        const [movedItem] = items.splice(currentIndex, 1);
        items.splice(newIndex, 0, movedItem);

        // Update orderIndex
        const updatedModules = items.map((module, index) => ({
            ...module,
            orderIndex: index
        }));

        setModules(updatedModules);
        toast.info('Module order updated');
    };

    // Mastery Test Functions
    const handleCreateMasteryTest = async (e) => {
        e.preventDefault();
        if (!selectedLevel) return;

        try {
            const payload = {
                levelId: selectedLevel.id,
                title: masteryTestForm.title,
                timeLimitMinutes: masteryTestForm.timeLimitMinutes
            };
            await adminService.createMasteryTest(payload);
            toast.success('Mastery test created successfully');
            setShowMasteryTestForm(false);
            resetMasteryTestForm();
            fetchMasteryTest(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to create mastery test');
        }
    };

    const handleUpdateMasteryTest = async (e) => {
        e.preventDefault();
        if (!editingMasteryTest) return;

        try {
            await adminService.updateMasteryTest(editingMasteryTest.id, masteryTestForm);
            toast.success('Mastery test updated successfully');
            setShowMasteryTestForm(false);
            setEditingMasteryTest(null);
            resetMasteryTestForm();
            fetchMasteryTest(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to update mastery test');
        }
    };

    const handleEditMasteryTest = (masteryTest) => {
        setEditingMasteryTest(masteryTest);
        setMasteryTestForm({
            title: masteryTest.title,
            timeLimitMinutes: masteryTest.timeLimitMinutes
        });
        setShowMasteryTestForm(true);
    };

    const handleDeleteMasteryTest = async (masteryTestId) => {
        if (!window.confirm('Are you sure you want to delete this mastery test? All questions will be lost.')) return;
        
        try {
            await adminService.deleteMasteryTest(masteryTestId);
            toast.success('Mastery test deleted successfully');
            fetchMasteryTest(selectedLevel.id);
        } catch (error) {
            toast.error('Failed to delete mastery test');
        }
    };

    const resetMasteryTestForm = () => {
        setMasteryTestForm({
            title: 'Mastery Test',
            timeLimitMinutes: null
        });
        setEditingMasteryTest(null);
    };

    const getReadTime = (content) => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const getTierColor = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-700';
            case 'intermediate': return 'bg-amber-100 text-amber-700';
            case 'advanced': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* LEFT PANEL - Levels */}
            <div className="w-80 bg-white border-r border-slate-200 pt-24 pb-6 overflow-y-auto">
                <div className="px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-slate-900">Levels</h2>
                        <button
                            onClick={() => {
                                resetLevelForm();
                                setShowLevelForm(true);
                            }}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm"
                        >
                            + Add Level
                        </button>
                    </div>

                    {/* Add Level Form */}
                    {showLevelForm && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                            <h3 className="text-sm font-bold text-indigo-900 mb-3">
                                {editingLevel ? 'Edit Level' : 'Add New Level'}
                            </h3>
                            <form onSubmit={editingLevel ? handleUpdateLevel : handleCreateLevel} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        value={levelForm.title}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Level title"
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={levelForm.tier}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, tier: e.target.value }))}
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={levelForm.masteryThreshold}
                                        onChange={(e) => setLevelForm(prev => ({ ...prev, masteryThreshold: parseFloat(e.target.value) }))}
                                        placeholder="Mastery Threshold (0.90)"
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm py-2"
                                    >
                                        {editingLevel ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowLevelForm(false);
                                            resetLevelForm();
                                        }}
                                        className="flex-1 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors text-sm py-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Levels List */}
                    <div className="space-y-4 mt-6">
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
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{level.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-lg capitalize ${getTierColor(level.tier)}`}>
                                                {level.tier}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {level.totalModules || 0} modules
                                            </span>
                                            {masteryTests[level.id] ? (
                                                <span className="px-2 py-1 text-xs font-bold rounded-lg bg-purple-100 text-purple-700">
                                                    Mastery Test · {masteryTests[level.id].questionCount || 0} questions
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-500">
                                                    No Mastery Test
                                                </span>
                                            )}
                                        </div>
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditLevel(level);
                                    }}
                                    className="w-full text-left p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium text-slate-600"
                                >
                                    Edit Name
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CENTER PANEL - Modules */}
            <div className="flex-1 bg-slate-50 pt-24 pb-6 overflow-y-auto">
                <div className="px-6">
                    {selectedLevel ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-900">
                                    {selectedLevel.title} - Modules
                                </h2>
                                <button
                                    onClick={() => {
                                        resetModuleForm();
                                        setShowModuleForm(true);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                >
                                    + Add Module
                                </button>
                            </div>

                            {showModuleForm && (
                                <div className="mb-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-3">
                                        {selectedModule ? 'Edit Module' : 'Create Module'}
                                    </h3>
                                    <form onSubmit={selectedModule ? handleUpdateModule : handleCreateModule} className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                required
                                                value={moduleForm.title}
                                                onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Module title"
                                                className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                required
                                                value={moduleForm.contentMarkdown}
                                                onChange={(e) => setModuleForm(prev => ({ ...prev, contentMarkdown: e.target.value }))}
                                                placeholder="Module content (Markdown supported)"
                                                rows={6}
                                                className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm py-2"
                                            >
                                                {selectedModule ? 'Update' : 'Create'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModuleForm(false);
                                                    resetModuleForm();
                                                }}
                                                className="flex-1 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors text-sm py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

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
                                                                        <div className="flex items-center gap-3 mb-2">
                                                                            <div className="p-2 bg-slate-100 rounded cursor-move">
                                                                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <h3 className="font-bold text-slate-900">{module.title}</h3>
                                                                                <p className="text-sm text-slate-500">
                                                                                    {getReadTime(module.contentMarkdown || '')} min read
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* Reorder arrows */}
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                onClick={() => moveModule(module.id, 'up')}
                                                                                disabled={index === 0}
                                                                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                                                </svg>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => moveModule(module.id, 'down')}
                                                                                disabled={index === modules.length - 1}
                                                                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleEditModule(module)}
                                                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
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

                            {/* Mastery Test Section */}
                            {selectedLevel && (
                                <div className="mt-8 border-t border-slate-200 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-black text-slate-900">Mastery Test</h3>
                                        {!masteryTests[selectedLevel.id] && (
                                            <button
                                                onClick={() => {
                                                    resetMasteryTestForm();
                                                    setShowMasteryTestForm(true);
                                                }}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                                            >
                                                + Add Mastery Test
                                            </button>
                                        )}
                                    </div>

                                    {masteryTests[selectedLevel.id] ? (
                                        <div className="bg-purple-50 rounded-xl border-2 border-purple-200 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="font-bold text-purple-900 text-lg">
                                                        {masteryTests[selectedLevel.id].title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {masteryTests[selectedLevel.id].timeLimitMinutes && (
                                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                                                Time Limit: {masteryTests[selectedLevel.id].timeLimitMinutes} min
                                                            </span>
                                                        )}
                                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                                                            Pass Mark: 90%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditMasteryTest(masteryTests[selectedLevel.id])}
                                                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMasteryTest(masteryTests[selectedLevel.id].id)}
                                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-purple-700">
                                                        Questions ({masteryTests[selectedLevel.id].questionCount || 0})
                                                    </span>
                                                    <button
                                                        onClick={() => navigate(`/admin/skill-paths/${id}/questions/${selectedLevel.id}`)}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors"
                                                    >
                                                        + Add Question
                                                    </button>
                                                </div>
                                                {masteryTests[selectedLevel.id].questionCount > 0 ? (
                                                    <div className="text-sm text-purple-600">
                                                        Click "Manage Tests" button above to view and edit questions
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-500 italic">
                                                        No questions added yet. Click "Add Question" to get started.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-300 rounded-xl">
                                            <p className="font-medium mb-2">No mastery test created yet</p>
                                            <p className="text-sm">Create a mastery test to assess student understanding of this level</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>Select a level to view and manage its modules</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL - Module Content Editor */}
            <div className="w-96 bg-white border-l border-slate-200 pt-24 pb-6 overflow-y-auto">
                {showMasteryTestForm ? (
                    <div className="px-6">
                        <h2 className="text-lg font-black text-slate-900 mb-6">
                            {editingMasteryTest ? 'Edit Mastery Test' : 'Create Mastery Test'}
                        </h2>
                        <form onSubmit={editingMasteryTest ? handleUpdateMasteryTest : handleCreateMasteryTest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Test Title</label>
                                <input
                                    type="text"
                                    required
                                    value={masteryTestForm.title}
                                    onChange={(e) => setMasteryTestForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Mastery Test"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Time Limit (minutes, optional)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={masteryTestForm.timeLimitMinutes || ''}
                                    onChange={(e) => setMasteryTestForm(prev => ({ ...prev, timeLimitMinutes: e.target.value ? parseInt(e.target.value) : null }))}
                                    placeholder="e.g., 60"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> Pass mark is automatically set to 90% and cannot be changed.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors py-2"
                                >
                                    {editingMasteryTest ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMasteryTestForm(false);
                                        resetMasteryTestForm();
                                    }}
                                    className="flex-1 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : showModuleForm ? (
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
                                <label className="block text-sm font-bold text-slate-700 mb-2">Module Content</label>
                                <textarea
                                    required
                                    value={moduleForm.contentMarkdown}
                                    onChange={(e) => setModuleForm(prev => ({ ...prev, contentMarkdown: e.target.value }))}
                                    placeholder="Module content (Markdown supported)"
                                    rows={12}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors py-2"
                                >
                                    {selectedModule ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModuleForm(false);
                                        resetModuleForm();
                                    }}
                                    className="flex-1 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : selectedModule ? (
                    <div className="px-6">
                        <h2 className="text-lg font-black text-slate-900 mb-6">Module Content</h2>
                        <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                            <h3 className="font-bold text-slate-900 mb-3">{selectedModule.title}</h3>
                            <div className="text-sm text-slate-600 whitespace-pre-wrap">
                                {selectedModule.contentMarkdown || 'No content available'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6">
                        <h2 className="text-lg font-black text-slate-900 mb-6">Module Content</h2>
                        <div className="text-center py-12 text-slate-500">
                            <p>Select a module to view and edit its content</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSkillPathEditor;
