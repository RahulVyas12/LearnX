// =============================================================
//  SkillPaths.jsx — "Choose Your Learning Path" section
//  Displays the available skill path cards on the landing page.
// =============================================================

import aptitude from '../../assets/aptitude.png';
import pythondev from '../../assets/pythondev.png';
import sql from '../../assets/sql.png';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router';

const PATHS = [
    {
        title: 'Python Developer',
        description: 'From basic syntax to building real-world Python applications.',
        image: pythondev,
        tag1: 'Full Stack', tag1Color: 'bg-violet-100 text-violet-700',
        tag2: 'Beginner', tag2Color: 'bg-blue-100   text-blue-700',
        modules: '10 Modules',
        levels: '5 Levels',
    },
    {
        title: 'SQL Developer',
        description: 'Master relational databases and advanced SQL scripting.',
        image: sql,
        tag1: 'Backend', tag1Color: 'bg-orange-100 text-orange-700',
        tag2: 'Intermediate', tag2Color: 'bg-sky-100    text-sky-700',
        modules: '12 Modules',
        levels: '4 Levels',
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Build problem-solving skills designed for tech interview success.',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
        tag1: 'DSA', tag1Color: 'bg-teal-100  text-teal-700',
        tag2: 'Intermediate', tag2Color: 'bg-sky-100   text-sky-700',
        modules: '15 Modules',
        levels: '6 Levels',
    },
    {
        title: 'Aptitude Preparation',
        description: 'Score more in placement exams with structured aptitude & reasoning modules.',
        image: aptitude,
        tag1: 'Aptitude', tag1Color: 'bg-rose-100  text-rose-700',
        tag2: 'Beginner', tag2Color: 'bg-blue-100  text-blue-700',
        modules: '8 Modules',
        levels: '3 Levels',
    },
];

const SkillPaths = () => {
    const { isAuthenticated } = useAuth();
    return (
        <section id="skill-paths" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div className="mb-16 text-center">
                    <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-primary">
                        SKILL PATHS
                    </span>
                    <h2 className="mb-4 text-4xl font-extrabold text-slate-900">Choose Your Learning Path</h2>
                    <p className="mx-auto max-w-2xl text-base text-slate-500">
                        Structured, job-oriented skill paths designed for CEIT students and upcoming professionals.
                    </p>
                </div>

                {/* Path card grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {PATHS.map((path) => (
                        <div
                            key={path.title}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Card image with tag overlay */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img
                                    src={path.image}
                                    alt={path.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                                {/* Tags */}
                                <div className="absolute left-3 top-3 flex gap-1.5">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${path.tag1Color}`}>{path.tag1}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${path.tag2Color}`}>{path.tag2}</span>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="mb-2 text-base font-bold leading-snug text-slate-900">{path.title}</h3>
                                <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">{path.description}</p>

                                {/* Module + level counts */}
                                <div className="mb-4 flex items-center gap-3 text-xs font-medium text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                                        </svg>
                                        {path.modules}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {path.levels}
                                    </span>
                                </div>

                                {/* Explore button */}
                                <Link 
                                    to={isAuthenticated ? "/skill-paths" : "/register"}
                                    className="group/btn flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary active:scale-95"
                                >
                                    Explore Path
                                    <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SkillPaths;
