// =============================================================
//  CTASection.jsx — Bottom call-to-action banner
//  Full-width gradient strip encouraging sign-up.
// =============================================================

import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const CTASection = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <section className="bg-gradient-to-br from-primary via-violet-700 to-blue-600 py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-4 text-4xl font-extrabold text-white">
                    Ready to Master Your Skills?
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-base text-violet-200">
                    Join thousands of CEIT students building job-ready skills through structured mastery-based learning.
                </p>
                <button
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-black text-primary shadow-xl transition-all hover:bg-violet-50 hover:shadow-2xl active:scale-95"
                >
                    {isAuthenticated ? 'Go to Your Dashboard →' : 'Start Learning Free — No Credit Card Required →'}
                </button>
            </div>
        </section>
    );
};


export default CTASection;
