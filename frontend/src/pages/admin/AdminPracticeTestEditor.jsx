import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminPracticeTestEditor = () => {
    const { id } = useParams(); // This is the ModuleId
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    
    // Form state
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('mcq');
    const [newScope, setNewScope] = useState('module');
    const [newOptions, setNewOptions] = useState(['', '', '', '']);
    const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await adminService.getQuestionsByModule(id);
            setQuestions(data);
        } catch (error) {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [id]);

    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        try {
            const questionData = {
                moduleId: id,
                questionText: newQuestionText,
                type: newQuestionType,
                scope: newScope,
                options: newQuestionType === 'mcq' ? JSON.stringify(newOptions) : null,
                correctAnswer: newCorrectAnswer,
                points: 1
            };
            
            if (editingId) {
                await adminService.updateQuestion(editingId, questionData);
                toast.success('Question updated');
            } else {
                await adminService.createQuestion(questionData);
                toast.success('Question added to test bank');
            }
            
            resetForm();
            fetchQuestions();
        } catch (error) {
            toast.error(editingId ? 'Failed to update' : 'Failed to save');
        }
    };

    const resetForm = () => {
        setNewQuestionText('');
        setNewQuestionType('mcq');
        setNewScope('module');
        setNewOptions(['', '', '', '']);
        setNewCorrectAnswer('');
        setEditingId(null);
        setIsAddMode(false);
    };

    const handleEditClick = (q) => {
        setEditingId(q.id);
        setNewQuestionText(q.questionText);
        setNewQuestionType(q.type);
        setNewScope(q.scope);
        setNewCorrectAnswer(q.correctAnswer);
        try {
            const opts = q.options ? JSON.parse(q.options) : ['', '', '', ''];
            setNewOptions(opts);
        } catch (e) {
            setNewOptions(['', '', '', '']);
        }
        setIsAddMode(true);
    };

    const handleDeleteQuestion = async (qId) => {
        if (!window.confirm('Remove this question?')) return;
        try {
            await adminService.deleteQuestion(qId);
            toast.success('Question removed');
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header & Breadcrumbs */}
            <div>
                <button onClick={() => window.history.back()} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Curriculum
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank</h1>
                            <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                                {questions.length} Items
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium mt-1 uppercase text-[11px] tracking-widest">Module Asset Management • ID: {id.substring(0,8)}</p>
                    </div>
                    <div className="flex gap-3">
                        {!isAddMode && (
                            <button 
                                onClick={() => setIsAddMode(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                New Question
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Question Authoring Form */}
            {isAddMode && (
                <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                            {editingId ? 'Update Mode' : 'Composer Mode'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmitQuestion} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Prompt</label>
                                <textarea 
                                    required
                                    rows="2"
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    placeholder="What is the output of..."
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none font-medium"
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Scope</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <select 
                                        value={newQuestionType}
                                        onChange={(e) => setNewQuestionType(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs uppercase"
                                    >
                                        <option value="mcq">MCQ</option>
                                        <option value="code">Code Snippet</option>
                                    </select>
                                    <select 
                                        value={newScope}
                                        onChange={(e) => setNewScope(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs uppercase"
                                    >
                                        <option value="module">Module Quiz</option>
                                        <option value="practice">Practice Set</option>
                                        <option value="mastery">Mastery Exam</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correct Answer</label>
                                <input 
                                    required
                                    type="text"
                                    value={newCorrectAnswer}
                                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                                    placeholder="Enter the exact answer"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm"
                                />
                            </div>

                            {newQuestionType === 'mcq' && (
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {newOptions.map((opt, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Option {idx + 1}</label>
                                            <input 
                                                required
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const updated = [...newOptions];
                                                    updated[idx] = e.target.value;
                                                    setNewOptions(updated);
                                                }}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all">
                                {editingId ? 'Save Changes' : 'Append Question'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List View */}
            <div className="space-y-3">
                {questions.map((q, index) => (
                    <div key={q.id} className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-500/30 transition-all flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 text-slate-400 font-black flex items-center justify-center text-xs border border-slate-100">
                            #{index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest ${q.type === 'mcq' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {q.type}
                                </span>
                                <span className="px-2 py-0.5 text-[9px] font-black bg-slate-100 text-slate-500 rounded uppercase tracking-widest">
                                    {q.scope}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-base mb-2">{q.questionText}</h3>
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer:</div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">{q.correctAnswer}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                                onClick={() => handleEditClick(q)}
                                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit Question"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button 
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete Question"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
                {questions.length === 0 && !isAddMode && (
                    <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 font-bold mb-4 italic">No questions found in this assessment bank.</p>
                        <button onClick={() => setIsAddMode(true)} className="text-emerald-600 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-600/30 hover:border-emerald-600 transition-all pb-0.5">Author First Question</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPracticeTestEditor;
