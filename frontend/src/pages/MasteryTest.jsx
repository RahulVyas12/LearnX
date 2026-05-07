import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import questionService from '../services/questionService';
import progressService from '../services/progressService';

const MasteryTest = () => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [levelId]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleNextQuestion();
        }
    }, [timeLeft, isSubmitted]);

    const fetchQuestions = async () => {
        try {
            const response = await questionService.getMasteryQuestions(levelId);
            setQuestions(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load mastery questions');
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30); // Reset timer for next question
        } else {
            handleSubmitTest();
        }
    };

    const handleSubmitTest = async () => {
        setIsSubmitted(true);
        
        const answersArray = questions.map(q => ({
            questionId: q.id,
            answer: answers[q.id] || ''
        }));

        try {
            const response = await progressService.submitTest({
                levelId,
                attemptType: 'mastery_test',
                answers: answersArray
            });
            
            setResult(response.data);
            setShowResult(true);
            
            // Show confetti if passed
            if (response.data.percentage >= 90) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
            }
        } catch (error) {
            toast.error('Failed to submit test');
            setIsSubmitted(false);
        }
    };

    const calculateScore = () => {
        if (!result) return 0;
        return Math.round(result.percentage);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (showResult && result) {
        const score = calculateScore();
        const passed = score >= 90;

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus_Jakarta_Sans'] relative">
                {/* Confetti Animation */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-bounce"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `-20px`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            >
                                <div className={`w-3 h-3 rounded-full ${
                                    ['bg-yellow-400', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500'][Math.floor(Math.random() * 5)]
                                }`} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="max-w-md w-full mx-auto p-6">
                    <div className={`bg-white rounded-2xl shadow-xl p-8 text-center relative ${
                        passed ? 'border-2 border-green-200' : 'border-2 border-amber-200'
                    }`}>
                        {passed && (
                            <div className="absolute -top-4 -right-4">
                                <span className="text-4xl">🎉</span>
                            </div>
                        )}
                        
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                            passed ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                            <svg className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {passed ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                            </svg>
                        </div>
                        
                        <h2 className={`text-2xl font-black mb-2 ${
                            passed ? 'text-green-800' : 'text-amber-800'
                        }`}>
                            {passed ? 'Level Mastered! 🎉' : `Score: ${score}%`}
                        </h2>
                        
                        <p className={`text-lg mb-6 ${
                            passed ? 'text-green-600' : 'text-amber-600'
                        }`}>
                            {passed ? 'Next Level Unlocked!' : 'Need 90% to unlock next level'}
                        </p>
                        
                        <div className="mb-6">
                            <div className="text-4xl font-black text-slate-900 mb-2">{score}%</div>
                            <p className="text-slate-600">
                                {result.correctAnswers} of {questions.length} questions correct
                            </p>
                        </div>

                        <div className="space-y-3">
                            {passed && (
                                <button
                                    onClick={() => navigate(`/skillpath/${result.skillPathId}`)}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all transform hover:scale-105"
                                >
                                    Continue to Next Level
                                </button>
                            )}
                            
                            <button
                                onClick={() => navigate(`/skillpath/${result.skillPathId}`)}
                                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Back to Skill Path
                            </button>
                            
                            {!passed && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navigate(`/skillpath/${result.skillPathId}`)}
                                        className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                                    >
                                        Review Modules
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
                                    >
                                        Retry Test
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold text-slate-900">Mastery Test</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                timeLeft <= 10 ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase">
                                {currentQuestion.type}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                {currentQuestion.points} points
                            </span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                90% to pass
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">
                            {currentQuestion.questionText}
                        </h2>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {currentQuestion.type === 'mcq' && currentQuestion.options && (
                            JSON.parse(currentQuestion.options).map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        answers[currentQuestion.id] === option
                                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            answers[currentQuestion.id] === option
                                                ? 'border-purple-500 bg-purple-500'
                                                : 'border-slate-300'
                                        }`}>
                                            {answers[currentQuestion.id] === option && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="font-medium">{option}</span>
                                    </div>
                                </button>
                            ))
                        )}

                        {currentQuestion.type === 'true_false' && (
                            <>
                                {['True', 'False'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                                            answers[currentQuestion.id] === option
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                answers[currentQuestion.id] === option
                                                    ? 'border-purple-500 bg-purple-500'
                                                    : 'border-slate-300'
                                            }`}>
                                                {answers[currentQuestion.id] === option && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span className="font-bold text-lg">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {currentQuestion.type === 'code' && (
                            <div className="space-y-4">
                                <textarea
                                    placeholder="Write your answer here..."
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                                    className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-sm"
                                />
                                <p className="text-sm text-slate-500">
                                    Note: Code questions are manually reviewed by instructors.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between">
                        <div className="text-sm text-slate-500">
                            {currentQuestionIndex + 1} of {questions.length} questions
                        </div>
                        <button
                            onClick={handleNextQuestion}
                            disabled={!answers[currentQuestion.id]}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${
                                answers[currentQuestion.id]
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Submit Mastery Test' : 'Next Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasteryTest;
