import { Link } from 'react-router';
import Logo from '../ui/Logo';


const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <Logo size="md" isDark={true} to="/dashboard" />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
                            Master Skills, Unlock Careers. A free mastery-based learning platform for CEIT students.
                        </p>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#skill-paths" className="hover:text-primary transition-colors">Skill Paths</a></li>
                            <li><a href="#how-it-works" className="hover:text-primary transition-colors">Practice Tests</a></li>
                            <li><a href="#certificates" className="hover:text-primary transition-colors">Certificates</a></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Skill Paths Column */}
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm">Skill Paths</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#skill-paths" className="hover:text-primary transition-colors">Python Developer</a></li>
                            <li><a href="#skill-paths" className="hover:text-primary transition-colors">SQL Developer</a></li>
                            <li><a href="#skill-paths" className="hover:text-primary transition-colors">DSA</a></li>
                            <li><a href="#skill-paths" className="hover:text-primary transition-colors">Aptitude Prep</a></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2024 LearnX. All rights reserved. Free for all students.</p>
                    <p className="flex items-center gap-1">
                        Made with
                        <svg className="w-3.5 h-3.5 text-rose-500 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        for CEIT students
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
