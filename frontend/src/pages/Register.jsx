import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Logo from '../components/ui/Logo';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Validation states
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const calculatePasswordStrength = (password) => {
        if (password.length < 6) return 'Weak';
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength <= 1) return 'Weak';
        if (strength === 2) return 'Medium';
        return 'Strong';
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = 'Name too short';
        }
        
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Minimum 8 characters';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Must contain uppercase letter';
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = 'Must contain at least one number';
        }
        
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        switch (field) {
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                setPasswordStrength(calculatePasswordStrength(value));
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'department':
                setDepartment(value);
                break;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            await register(fullName, email, password, department);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 'Weak': return 'text-red-500';
            case 'Medium': return 'text-yellow-500';
            case 'Strong': return 'text-green-500';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-12 font-['Plus_Jakarta_Sans']">
            {/* Subtle background accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Logo size="lg" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
                        <p className="mt-1.5 text-sm text-slate-500 font-medium">Start your learning journey today — it's free</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                            <input
                                id="register-name"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="John Doe"
                                className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/10 ${
                                    errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-indigo-500'
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="you@example.com"
                                className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/10 ${
                                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-indigo-500'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 pr-11 text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-3 ${
                                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                            {password && (
                                <p className={`text-xs mt-1 ${getPasswordStrengthColor()}`}>
                                    Password strength: {passwordStrength}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="register-confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your password"
                                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 pr-11 text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-3 ${
                                        errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                                    }`}
                                />
                                {confirmPassword && password === confirmPassword && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Department <span className="text-slate-400 font-normal normal-case">(Optional)</span></label>
                            <input
                                id="register-department"
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="e.g. Computer Science"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Role selection removed for security */}

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                    © {new Date().getFullYear()} LearnX. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;
