// =============================================================
//  CertificationSection.jsx
//  "Earn Verified Certificates" marketing section on the home page.
// =============================================================

import { useNavigate } from 'react-router';
import certification from '../../assets/certification.png';

// Benefits listed under the section heading
const CHECK_ITEMS = [
    'Complete Beginner, Intermediate & Advanced levels',
    'Score 90%+ on every level Mastery Test',
    'Issued a tamper-evident certificate in PNG',
    'Share directly to LinkedIn or download as PDF',
];

const CertificationSection = () => {
    const navigate = useNavigate();

    return (
        <section id="certificates" className="bg-slate-50 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-2">

                    {/* ── Left: text content ── */}
                    <div>
                        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">
                            CERTIFICATION
                        </span>
                        <h2 className="mb-5 text-4xl font-extrabold leading-tight text-slate-900">
                            Earn Verified Certificates
                        </h2>
                        <p className="mb-8 text-base leading-relaxed text-slate-500">
                            Complete all levels in a skill path and generate a professional certificate that
                            validates your mastery. Share it on LinkedIn, attach it to your resume, or
                            showcase it to employers.
                        </p>

                        {/* Checklist */}
                        <ul className="mb-8 space-y-3.5">
                            {CHECK_ITEMS.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                        <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/register')}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 active:scale-95"
                        >
                            🎓 Start Earning Certificates
                        </button>
                    </div>

                    {/* ── Right: certificate image ── */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Soft glow behind the card */}
                            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-100 to-blue-100 opacity-60 blur-xl" />
                            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
                                <img src={certification} alt="LearnX Certificate" className="w-full max-w-sm rounded-xl" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CertificationSection;
