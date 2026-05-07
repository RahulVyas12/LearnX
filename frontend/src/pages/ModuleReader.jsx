import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import skillPathService from '../services/skillPathService';
import progressService from '../services/progressService';

const ModuleReader = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [module, setModule] = useState(null);
    const [level, setLevel] = useState(null);
    const [skillPath, setSkillPath] = useState(null);
    const [modules, setModules] = useState([]);
    const [isRead, setIsRead] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (moduleId) {
            fetchModuleData();
        }
    }, [moduleId]);

    const fetchModuleData = async () => {
        try {
            const moduleRes = await skillPathService.getModuleDetail(moduleId);
            const moduleData = moduleRes.data;
            setModule(moduleData);
            
            // Fetch related data
            await fetchRelatedData(moduleData.levelId);
        } catch (error) {
            toast.error('Failed to load module');
            setLoading(false);
        }
    };

    const fetchRelatedData = async (levelId) => {
        try {
            const [levelRes, modulesRes] = await Promise.all([
                skillPathService.getLevels(levelId),
                skillPathService.getModules(levelId)
            ]);

            setLevel(levelRes.data);
            setModules(modulesRes.data);

            // Fetch skill path details
            const skillPathRes = await skillPathService.getById(levelRes.data.skillPathId);
            setSkillPath(skillPathRes.data);
        } catch (error) {
            console.error('Failed to fetch related data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async () => {
        if (!user || isRead) return;

        try {
            await progressService.markModuleAsRead(moduleId);
            setIsRead(true);
            toast.success('Module completed!');
        } catch (error) {
            toast.error('Failed to mark module as read');
        }
    };

    const getReadTime = (content) => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const getCurrentModuleIndex = () => {
        return modules.findIndex(m => m.id === moduleId);
    };

    const navigateToModule = (direction) => {
        const currentIndex = getCurrentModuleIndex();
        let targetIndex;

        if (direction === 'prev') {
            targetIndex = currentIndex - 1;
        } else {
            targetIndex = currentIndex + 1;
        }

        if (targetIndex >= 0 && targetIndex < modules.length) {
            navigate(`/module/${modules[targetIndex].id}`);
        }
    };

    const canTakeModuleTest = () => {
        // Check if all modules in this level are read
        return modules.every(m => {
            if (m.id === moduleId) return isRead; // Current module
            return true; // TODO: Check other modules' read status
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Module Not Found</h2>
                    <button
                        onClick={() => navigate('/skillpaths')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Skill Paths
                    </button>
                </div>
            </div>
        );
    }

    const currentIndex = getCurrentModuleIndex();
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < modules.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/skillpath/${skillPath?.id}`)}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">{module.title}</h1>
                                <p className="text-sm text-slate-500">
                                    {level?.title} • {skillPath?.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                {getReadTime(module.contentMarkdown)} min read
                            </span>
                            {isRead && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    ✓ Completed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Module List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                Level Modules
                            </h3>
                            <div className="space-y-2">
                                {modules.map((m, index) => (
                                    <button
                                        key={m.id}
                                        onClick={() => navigate(`/module/${m.id}`)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                                            m.id === moduleId
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                                m.id === moduleId
                                                    ? 'border-indigo-500 bg-indigo-500 text-white'
                                                    : 'border-slate-300 text-slate-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{m.title}</p>
                                                <p className="text-xs text-slate-500">
                                                    {getReadTime(m.contentMarkdown)} min
                                                </p>
                                            </div>
                                            {m.id === moduleId && isRead && (
                                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-slate-200 p-8">
                            <div className="prose prose-slate max-w-none">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {module.contentMarkdown}
                                </ReactMarkdown>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-12 pt-8 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        {hasPrevious && (
                                            <button
                                                onClick={() => navigateToModule('prev')}
                                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous Module
                                            </button>
                                        )}
                                        {hasNext && (
                                            <button
                                                onClick={() => navigateToModule('next')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                            >
                                                Next Module
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {!isRead && user && (
                                            <button
                                                onClick={handleMarkAsRead}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Mark as Read
                                            </button>
                                        )}

                                        {canTakeModuleTest() && (
                                            <button
                                                onClick={() => navigate(`/test/module/${level?.id}`)}
                                                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Take Module Test
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Ready for Test Banner */}
                                {isRead && canTakeModuleTest() && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <div>
                                                <p className="font-bold text-green-800">Ready for Module Test!</p>
                                                <p className="text-sm text-green-600">You've completed all modules in this level.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleReader;
