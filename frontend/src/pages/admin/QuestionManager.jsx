import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const QuestionManager = () => {
    const { id, levelId } = useParams();
    const navigate = useNavigate();
    
    const [skillPath, setSkillPath] = useState(null);
    const [level, setLevel] = useState(null);
    const [modules, setModules] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [activeTab, setActiveTab] = useState('module'); // 'module' | 'mastery'
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [questionForm, setQuestionForm] = useState({
        moduleId: null,
        levelId: levelId,
        scope: 'module',
        type: 'mcq',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
        explanation: '',
        codeTemplate: '',
        expectedOutput: ''
    });

    useEffect(() => {
        fetchData();
    }, [id, levelId]);

    const fetchData = async () => {
        try {
            const [skillPathRes, levelRes, modulesRes] = await Promise.all([
                adminService.getSkillPathById(id),
                adminService.getLevels(id).then(res => res.data.find(l => l.id === levelId)),
                adminService.getModules(levelId)
            ]);
            
            setSkillPath(skillPathRes.data);
            setLevel(levelRes);
            setModules(modulesRes.data);
            
            if (modulesRes.data.length > 0) {
                setSelectedModule(modulesRes.data[0].id);
            }
            
            await fetchQuestions();
        } catch (error) {
            toast.error('Failed to load data');
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            let response;
            if (activeTab === 'module' && selectedModule) {
                response = await adminService.getQuestionsByModule(selectedModule);
            } else {
                response = await adminService.getQuestionsByModule(levelId); // This should be mastery questions
            }
            setQuestions(response.data || []);
        } catch (error) {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [activeTab, selectedModule]);

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        
        const payload = {
            moduleId: activeTab === 'module' ? selectedModule : null,
            levelId: activeTab === 'mastery' ? levelId : null,
            scope: activeTab,
            type: questionForm.type,
            questionText: questionForm.questionText,
            options: questionForm.type === 'mcq' ? JSON.stringify(questionForm.options.filter(opt => opt.trim())) : 
                     questionForm.type === 'true_false' ? JSON.stringify(['True', 'False']) : null,
            correctAnswer: questionForm.correctAnswer,
            points: questionForm.points,
            explanation: questionForm.explanation
        };

        try {
            await adminService.createQuestion(payload);
            toast.success('Question created successfully');
            setShowQuestionForm(false);
            resetQuestionForm();
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to create question');
        }
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        if (!editingQuestion) return;

        const payload = {
            moduleId: activeTab === 'module' ? selectedModule : null,
            levelId: activeTab === 'mastery' ? levelId : null,
            scope: activeTab,
            type: questionForm.type,
            questionText: questionForm.questionText,
            options: questionForm.type === 'mcq' ? JSON.stringify(questionForm.options.filter(opt => opt.trim())) : 
                     questionForm.type === 'true_false' ? JSON.stringify(['True', 'False']) : null,
            correctAnswer: questionForm.correctAnswer,
            points: questionForm.points,
            explanation: questionForm.explanation
        };

        try {
            await adminService.updateQuestion(editingQuestion.id, payload);
            toast.success('Question updated successfully');
            setShowQuestionForm(false);
            setEditingQuestion(null);
            resetQuestionForm();
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to update question');
        }
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setQuestionForm({
            moduleId: question.moduleId,
            levelId: question.levelId,
            scope: question.scope,
            type: question.type,
            questionText: question.questionText,
            options: question.options ? JSON.parse(question.options) : ['', '', '', ''],
            correctAnswer: question.correctAnswer,
            points: question.points,
            explanation: question.explanation || '',
            codeTemplate: question.codeTemplate || '',
            expectedOutput: question.expectedOutput || ''
        });
        setShowQuestionForm(true);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        
        try {
            await adminService.deleteQuestion(questionId);
            toast.success('Question deleted successfully');
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to delete question');
        }
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            moduleId: null,
            levelId: levelId,
            scope: activeTab,
            type: 'mcq',
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            points: 1,
            explanation: '',
            codeTemplate: '',
            expectedOutput: ''
        });
        setEditingQuestion(null);
    };

    const getQuestionTypeColor = (type) => {
        switch (type) {
            case 'mcq': return 'bg-blue-100 text-blue-700';
            case 'true_false': return 'bg-green-100 text-green-700';
            case 'code': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/admin/skillpaths/${id}/edit`)}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Question Manager</h1>
                                <p className="text-sm text-slate-500">
                                    {skillPath?.title} • {level?.title}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/skillpaths/${id}/edit`)}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                        >
                            Back to Editor
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex border border-slate-200 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('module')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'module'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                Module Tests
                            </button>
                            <button
                                onClick={() => setActiveTab('mastery')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'mastery'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                Mastery Test
                            </button>
                        </div>
                        
                        <button
                            onClick={() => {
                                resetQuestionForm();
                                setShowQuestionForm(true);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Add Question
                        </button>
                    </div>

                    {/* Module Selector for Module Tests */}
                    {activeTab === 'module' && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Module</label>
                            <select
                                value={selectedModule || ''}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {modules.map(module => (
                                    <option key={module.id} value={module.id}>
                                        {module.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-4">
                        {questions.map((question) => (
                            <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${getQuestionTypeColor(question.type)}`}>
                                                {question.type.toUpperCase()}
                                            </span>
                                            <span className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600">
                                                {question.points} points
                                            </span>
                                        </div>
                                        <p className="text-slate-900 font-medium mb-2">{question.questionText}</p>
                                        {question.type === 'mcq' && question.options && (
                                            <div className="text-sm text-slate-600">
                                                {JSON.parse(question.options).map((option, idx) => (
                                                    <div key={idx} className={option === question.correctAnswer ? 'font-bold text-green-600' : ''}>
                                                        {String.fromCharCode(65 + idx)}. {option}
                                                        {option === question.correctAnswer && ' ✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {question.explanation && (
                                            <p className="text-sm text-slate-500 mt-2 italic">Explanation: {question.explanation}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleEditQuestion(question)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {questions.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <p>No questions found. Add your first question to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Question Form Modal */}
                {showQuestionForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-xl font-black text-slate-800">
                                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                </h3>
                            </div>
                            
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {/* Type Tabs */}
                                <div className="flex border border-slate-200 rounded-lg p-1 mb-6">
                                    {['mcq', 'true_false', 'code'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setQuestionForm(prev => ({ ...prev, type }))}
                                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                questionForm.type === type
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                        >
                                            {type === 'mcq' ? 'MCQ' : type === 'true_false' ? 'True/False' : 'Code'}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion} className="space-y-4">
                                    {/* Question Text */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Question Text</label>
                                        <textarea
                                            required
                                            value={questionForm.questionText}
                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, questionText: e.target.value }))}
                                            rows={3}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* MCQ Options */}
                                    {questionForm.type === 'mcq' && (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-slate-700">Options</label>
                                            {['A', 'B', 'C', 'D'].map((label, idx) => (
                                                <div key={label} className="flex items-center gap-3">
                                                    <span className="w-8 text-sm font-bold text-slate-600">{label}.</span>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={questionForm.options[idx]}
                                                        onChange={(e) => {
                                                            const newOptions = [...questionForm.options];
                                                            newOptions[idx] = e.target.value;
                                                            setQuestionForm(prev => ({ ...prev, options: newOptions }));
                                                        }}
                                                        placeholder={`Option ${label}`}
                                                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* True/False Options */}
                                    {questionForm.type === 'true_false' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Correct Answer</label>
                                            <div className="flex gap-4">
                                                {['True', 'False'].map(option => (
                                                    <label key={option} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="tf-answer"
                                                            value={option}
                                                            checked={questionForm.correctAnswer === option}
                                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                                            className="text-indigo-600"
                                                        />
                                                        <span className="font-medium">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* MCQ Correct Answer */}
                                    {questionForm.type === 'mcq' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Correct Answer</label>
                                            <div className="flex gap-2">
                                                {['A', 'B', 'C', 'D'].map(label => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => setQuestionForm(prev => ({ ...prev, correctAnswer: label }))}
                                                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                                            questionForm.correctAnswer === label
                                                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                                                                : 'bg-slate-100 text-slate-600 border-2 border-transparent'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Code Question Fields */}
                                    {questionForm.type === 'code' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Expected Output</label>
                                                <textarea
                                                    value={questionForm.expectedOutput}
                                                    onChange={(e) => setQuestionForm(prev => ({ ...prev, expectedOutput: e.target.value }))}
                                                    rows={3}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <p className="text-sm text-amber-800">
                                                    <strong>Note:</strong> Code answers are manually reviewed by admin.
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* Points */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Points</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={questionForm.points}
                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Explanation */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Explanation (Optional)</label>
                                        <textarea
                                            value={questionForm.explanation}
                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                                            rows={2}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowQuestionForm(false);
                                                resetQuestionForm();
                                            }}
                                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                        >
                                            {editingQuestion ? 'Update Question' : 'Create Question'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionManager;
