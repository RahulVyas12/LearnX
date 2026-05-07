import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ResultView from '../components/skillpath/ResultView';
import TestView from '../components/skillpath/TestView';

// Services
import questionService from '../services/questionService';
import skillPathService from '../services/skillPathService';

export default function PracticeTestPlayer() {
    const { id } = useParams(); // skillPathId
    const navigate = useNavigate();

    // Test State
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [randomizedTest, setRandomizedTest] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadPracticeTest = async () => {
        setLoading(true);
        try {
            const [pathRes, questionsRes] = await Promise.all([
                skillPathService.getById(id),
                questionService.getPracticeQuestions(id)
            ]);

            const path = pathRes.data;
            const questions = questionsRes.data;

            const formattedQuestions = questions.map(q => ({
                id: q.id,
                text: q.questionText,
                options: q.options ? JSON.parse(q.options) : [],
                correct: q.correctAnswer, // Warning: Practice tests might reveal correct answer if not careful
                points: q.points
            }));

            setRandomizedTest({
                id,
                title: `${path.title} Practice`,
                questions: formattedQuestions
            });
            setTimeLeft(formattedQuestions.length * 90);
            setCurrentQuestionIdx(0);
            setSelectedAnswers({});
            setIsFinished(false);
            setTestResult(null);
        } catch (error) {
            console.error('Error loading practice test:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPracticeTest();
    }, [id]);

    // Timer effect
    useEffect(() => {
        let timer;
        if (!isFinished && timeLeft > 0 && randomizedTest) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && !isFinished && randomizedTest) {
            handleFinishTest();
        }
        return () => clearInterval(timer);
    }, [isFinished, timeLeft, randomizedTest]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleFinishTest = async () => {
        const questions = randomizedTest?.questions || [];
        const answers = questions.map((q, idx) => ({
            questionId: q.id,
            userAnswer: selectedAnswers[idx] || ''
        }));

        try {
            const response = await progressService.submitTest({
                skillPathId: id,
                attemptType: 'practice',
                answers
            });
            const result = response.data;

            setTestResult({
                score: Math.round(result.score * 100),
                correct: result.correctCount,
                total: result.totalQuestions,
                passed: result.passed,
                testName: randomizedTest.title,
                isPractice: true
            });
            setIsFinished(true);
        } catch (error) {
            console.error('Error logging practice test:', error);
            toast.error('Failed to save test results.');
            
            // Fallback to local calculation if API fails
            let localCorrect = 0;
            questions.forEach((q, idx) => {
                if (selectedAnswers[idx] === q.correct) localCorrect++;
            });
            const localScore = Math.round((localCorrect / questions.length) * 100);
            setTestResult({
                score: localScore,
                correct: localCorrect,
                total: questions.length,
                passed: localScore >= 70,
                testName: randomizedTest.title,
                isPractice: true
            });
            setIsFinished(true);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    if (!randomizedTest) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Practice Test Not Found</h2>
                <button
                    onClick={() => navigate('/practice-tests')}
                    className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all"
                >
                    Back to Practice Section
                </button>
            </div>
        );
    }

    if (isFinished && testResult) {
        return (
            <ResultView
                testResult={testResult}
                onClose={() => navigate('/practice-tests')}
                onRetry={loadPracticeTest}
            />
        );
    }

    return (
        <TestView
            activeTest={randomizedTest}
            currentQuestionIdx={currentQuestionIdx}
            setCurrentQuestionIdx={setCurrentQuestionIdx}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            timeLeft={timeLeft}
            formatTime={formatTime}
            handleFinishTest={handleFinishTest}
        />
    );
}
