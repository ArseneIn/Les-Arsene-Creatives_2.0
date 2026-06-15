import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { institutionService } from '../services/institution';
import type { Institution } from '../types/institution';
import { isAxiosError } from 'axios';
import { Keyboard, School, User, Lock, Eye, ArrowRight, ChevronDown } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const data = await institutionService.getAll();
                setInstitutions(data);
            } catch (err) {
                console.error('Failed to fetch institutions:', err);
            }
        };

        fetchInstitutions();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email.includes('@') && !institution) {
            setError('Please select your institution to log in with a Student ID.');
            setLoading(false);
            return;
        }

        try {
            const user = await login(email, password, institution);

            switch (user.role) {
                case UserRole.PLATFORM_ADMIN:
                    navigate('/super-admin');
                    break;
                case UserRole.INSTITUTION_ADMIN:
                    navigate('/admin');
                    break;
                case UserRole.FACILITATOR:
                    navigate('/facilitator');
                    break;
                case UserRole.STUDENT:
                    navigate('/');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            console.error(err);
            if (isAxiosError(err) && err.response?.data?.message) {
                // If it's an array of messages (like class-validator), just join them
                const msg = err.response.data.message;
                setError(Array.isArray(msg) ? msg.join(', ') : msg);
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full grid lg:grid-cols-2 bg-background-light dark:bg-background-dark font-display overflow-hidden">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex flex-col justify-between relative bg-[#061824] text-white p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/students_typing.png')] bg-cover bg-center opacity-45 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#061824] via-[#061824]/90 to-[#33B974]/45"></div>
                    {/* Animated shapes */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#33B974]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#094A71]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#33B974]/20 p-2 rounded-lg backdrop-blur-sm border border-[#33B974]/30">
                            <Keyboard className="text-[#33B974] w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Typespire</h1>
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold leading-tight mb-4">Master the Art of <span className="text-[#33B974]">Professional Typing</span></h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            Join thousands of students and professionals enhancing their productivity through our advanced typing analytics and adaptive learning platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div
                className="flex flex-col justify-center items-center p-6 relative bg-white dark:bg-slate-900 h-full overflow-y-auto"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/assets/login_doodle_bg.png')`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat'
                }}
            >
                <div className="w-full max-w-[420px] flex flex-col gap-6">
                    {/* Mobile Logo (visible only on small screens) */}
                    <div className="lg:hidden flex items-center gap-2 mb-2">
                        <Keyboard className="text-[#33B974] w-8 h-8" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Typespire</h1>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        {/* Institution Selector */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Institution</label>
                            <div className="relative">
                                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                                <select
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all appearance-none cursor-pointer text-sm"
                                >
                                    <option value="" disabled>Select your institution</option>
                                    {institutions.map((inst) => (
                                        <option key={inst.id} value={inst.slug}>
                                            {inst.name}
                                        </option>
                                    ))}

                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px] pointer-events-none" />
                            </div>
                        </div>

                        {/* Email/ID Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student ID or Email</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your ID or email"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-xs font-medium text-[#094A71] hover:text-[#094A71]/80 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#33B974]/50 focus:border-[#33B974] outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <Eye className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-slate-300 text-[#33B974] focus:ring-[#33B974]" />
                            <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">Remember for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-[#094A71]/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-[18px] h-[18px]" />
                                </>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Don't have an account? <Link to="/register" className="font-bold text-[#33B974] hover:underline">Create an account</Link>
                    </p>
                </div>

            </div>
        </div>

    );
};

export default Login;
