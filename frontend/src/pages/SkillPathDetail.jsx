import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

// Components
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';
import LessonView from '../components/skillpath/LessonView';
import LevelSection from '../components/skillpath/LevelSection';
import PathHeader from '../components/skillpath/PathHeader';
import ResultView from '../components/skillpath/ResultView';
import TestView from '../components/skillpath/TestView';
import CongratsModal from '../components/skillpath/CongratsModal';

// Services
import skillPathService from '../services/skillPathService';
import progressService from '../services/progressService';
import questionService from '../services/questionService';
import certificateService from '../services/certificateService';

export default function SkillPathDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewingModule, setViewingModule] = useState(null);
    const [path, setPath] = useState(null);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Test State
    const [activeTest, setActiveTest] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    // Track which level the active mastery test belongs to
    const activeLevelIdRef = useRef(null);
    const [claimedCertificate, setClaimedCertificate] = useState(null);

    // ── Initial Data Fetch ──────────────────────────────────────────
    useEffect(() => {
        async function fetchData() {
            try {
                const [pathRes, levelsRes, statusRes] = await Promise.all([
                    skillPathService.getById(id),
                    skillPathService.getLevels(id),
                    progressService.getLevelStatus(id)
                ]);

                const pathData = pathRes.data;
                const levelsData = levelsRes.data;
                const statusData = statusRes.data;

                setPath(pathData);

                // For each level, fetch its modules
                const levelsWithModules = await Promise.all(levelsData.map(async (level) => {
                    const modulesRes = await skillPathService.getModulesByLevel(level.id);
                    const modules = modulesRes.data;
                    const status = statusData.find(s => s.levelId === level.id);

                    return {
                        ...level,
                        modules: modules.map(m => ({
                            id: m.id,
                            title: m.title,
                            type: 'lesson', // or 'test' if we add internal tests
                            readTime: m.readTime || '5 min',
                            isCompleted: false // we can improve this later with module progress
                        })),
                        status: status?.status || 'locked',
                        isUnlocked: status?.isUnlocked || false,
                        badge: level.tier,
                        description: `Master the ${level.tier} concepts of ${pathData.title}.`,
                        masteryTest: {
                            id: level.id,
                            title: `${level.title} Mastery Test`,
                            score: 90,
                            questions: [] // will fetch when starting
                        }
                    };
                }));

                setLevels(levelsWithModules);
            } catch (error) {
                console.error('Error fetching path detail:', error);
                setPath(null); // Explicitly set to null on error
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    // Timer effect for tests
    useEffect(() => {
        let timer;
        if (activeTest && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && activeTest) {
            handleFinishTest();
        }
        return () => clearInterval(timer);
    }, [activeTest, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleTakeTest = async (test, levelId) => {
        try {
            const response = await questionService.getMasteryQuestions(levelId);
            const questions = response.data;
            activeLevelIdRef.current = levelId;
            setActiveTest({
                ...test,
                questions: questions.map(q => ({
                    id: q.id,
                    text: q.questionText,
                    options: q.options ? JSON.parse(q.options) : [],
                    points: q.points
                }))
            });
            setCurrentQuestionIdx(0);
            setSelectedAnswers({});
            setTimeLeft( questions.length * 90 ); // 90s per question
            setTestResult(null);
        } catch (error) {
            console.error('Error loading test questions:', error);
        }
    };

    const handleFinishTest = async () => {
        const answers = Object.entries(selectedAnswers).map(([idx, choice]) => ({
            questionId: activeTest.questions[parseInt(idx)].id,
            userAnswer: choice
        }));

        try {
            const response = await progressService.submitTest({
                levelId: activeLevelIdRef.current,
                attemptType: 'mastery_test',
                answers
            });
            const result = response.data;

            const passed = result.passed;
            const score = Math.round(result.score * 100);

            let nextLevelName = null;
            let nextLevelId = null;

            if (passed) {
                // Find next level in local state to show "Next Level" prompt
                const currentIdx = levels.findIndex(l => l.id === activeLevelIdRef.current);
                if (currentIdx !== -1 && currentIdx + 1 < levels.length) {
                    const next = levels[currentIdx+1];
                    nextLevelId = next.id;
                    nextLevelName = next.title;
                }
                
                // Refresh level status in local state
                const response = await progressService.getLevelStatus(id);
                const newStatus = response.data;
                setLevels(prev => prev.map(l => {
                    const s = newStatus.find(stat => stat.levelId === l.id);
                    return {
                        ...l,
                        status: s?.status || l.status,
                        isUnlocked: s?.isUnlocked || l.isUnlocked
                    };
                }));
            }

            setTestResult({
                score,
                correct: result.correctCount,
                total: result.totalQuestions,
                passed,
                testName: activeTest.title,
                originalTest: activeTest,
                currentLevelId: activeLevelIdRef.current,
                nextLevelId,
                nextLevelName,
            });
            setActiveTest(null);
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    const handleStartModule = (mod) => {
        navigate(`/module/${mod.id}`);
    };

    const handleMarkAsRead = async () => {
        if (!viewingModule) return;
        try {
            await progressService.markModuleAsRead(viewingModule.id);
            // Optionally update UI to show checkmark
        } catch (error) {
            console.error('Error marking module as read:', error);
        }
    };

    const handleClaimCertificate = async () => {
        try {
            const response = await certificateService.claimCertificate(id);
            setClaimedCertificate(response.data);
            toast.success('Certificate claimed successfully!');
        } catch (error) {
            console.error('Error claiming certificate:', error);
            toast.error('Failed to claim certificate. Please try again.');
        }
    };

    const allLevelsCompleted = levels.length > 0 && levels.every(l => l.status === 'completed');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    if (testResult) {
        return (
            <ResultView
                testResult={testResult}
                onClose={() => setTestResult(null)}
                onRetry={() => handleTakeTest(testResult.originalTest, testResult.currentLevelId)}
                nextLevelName={testResult.nextLevelName}
                onNextLevel={
                    testResult.nextLevelId ? () => setTestResult(null) : null
                }
            />
        );
    }

    if (activeTest) {
        return (
            <TestView
                activeTest={activeTest}
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


    return (
        <div className="flex h-screen overflow-hidden bg-white">
            {claimedCertificate && (
                <CongratsModal 
                    cert={claimedCertificate} 
                    onClose={() => setClaimedCertificate(null)} 
                />
            )}
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="skill-paths" />

            <div className="flex flex-1 flex-col overflow-y-auto lg:pl-72">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/skill-paths')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-black uppercase tracking-widest mb-6"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Skill Paths
                    </button>

                    {path ? (
                        <PathHeader path={{
                            ...path,
                            image: path.imageUrl ? 
                                (path.imageUrl.startsWith('http') ? path.imageUrl : `http://localhost:5000${path.imageUrl}`) : 
                                `https://api.dicebear.com/7.x/shapes/svg?seed=${path.title}`,
                            author: 'Instructional Team',
                            duration: `${path.totalLevels * 2} weeks`,
                            enrolled: 1200 + Math.floor(Math.random() * 500)
                        }} />
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                             <p className="text-slate-500 font-bold">Failed to load path details. Please try again later.</p>
                        </div>
                    )}

                    {/* Mastery Info Box */}
                    <div className="mb-10 flex items-start gap-4 bg-[#f0f7ff] p-5 rounded-2xl border border-[#e0efff] text-[#2b6cb0]">
                        <svg className="w-5 h-5 shrink-0 mt-0.5 text-[#4f46e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                            <h4 className="text-[13px] font-black uppercase tracking-wider text-[#3730a3]">Mastery-Based Progression</h4>
                            <p className="text-[11px] font-bold opacity-80 mt-0.5 leading-relaxed">Complete all modules in a level, then pass the Level Mastery Test with <span className="text-[#4f46e5]">90% or higher</span> to unlock the next level.</p>
                        </div>
                    </div>

                    {/* Levels Section */}
                    <div className="space-y-12">
                        {levels.map((level, idx) => (
                            <LevelSection
                                key={level.id}
                                level={level}
                                index={idx}
                                onStartModule={(mod) => handleStartModule(mod, level.id)}
                                onReviewModule={(mod) => handleStartModule(mod, level.id)}
                                onTakeMasteryTest={(test) => handleTakeTest(test, level.id)}
                            />
                        ))}
                    </div>

                    {/* Final Reward / Certification Card */}
                    <div className="mt-16 p-px bg-linear-to-r from-amber-400 via-amber-100 to-amber-400 rounded-2xl shadow-sm">
                        <div className="bg-[#fffcf0]/90 rounded-[15px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-xl border border-amber-100">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Complete All Levels → Earn Certificate</h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1 italic">Finish all {path?.totalLevels} architectural levels and pass every mastery verification.</p>
                                </div>
                            </div>
                            <button
                                disabled={!allLevelsCompleted}
                                onClick={handleClaimCertificate}
                                className={`px-8 py-4 text-xs font-black rounded-xl border uppercase tracking-widest flex items-center gap-2 transition-all ${allLevelsCompleted
                                        ? 'bg-amber-500 text-white border-amber-600 shadow-xl shadow-amber-200 hover:bg-amber-600 active:scale-95 cursor-pointer'
                                        : 'bg-amber-200 text-amber-800 border-amber-300 opacity-60 cursor-not-allowed'
                                    }`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    {allLevelsCompleted
                                        ? <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        : <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                                    }
                                </svg>
                                {allLevelsCompleted ? 'Claim Certificate' : 'Locked'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
