import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

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
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full grid lg:grid-cols-2 bg-background-light dark:bg-background-dark font-display overflow-hidden">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex flex-col justify-between relative bg-[#0f172a] text-white p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/students_typing.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/95 to-primary/20"></div>
                    {/* Animated shapes */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-sm border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-2xl">keyboard</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Typespire</h1>
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold leading-tight mb-4">Master the Art of <span className="text-primary">Professional Typing</span></h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            Join thousands of students and professionals enhancing their productivity through our advanced typing analytics and adaptive learning platform.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 max-w-md">
                        <div className="flex gap-1 text-yellow-400 mb-2">
                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                        </div>
                        <p className="text-slate-200 italic text-sm mb-3">"Typespire has completely transformed how our institution approaches digital literacy. The analytics are unmatched."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 bg-[url('https://randomuser.me/api/portraits/women/44.jpg')] bg-cover"></div>
                            <div>
                                <p className="font-bold text-sm">Dr. Sarah Mitchell</p>
                                <p className="text-xs text-slate-400">Dean of Technology, Kepler College</p>
                            </div>
                        </div>
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
                        <span className="material-symbols-outlined text-primary text-3xl">keyboard</span>
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
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">school</span>
                                <select
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-sm"
                                >
                                    <option value="" disabled>Select your institution</option>
                                    <option value="kepler">Kepler College</option>
                                    <option value="mit">MIT</option>
                                    <option value="stanford">Stanford University</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px] pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Email/ID Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student ID or Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">person</span>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your ID or email"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary" />
                            <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">Remember for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Access Section */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Quick Demo Access</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('student@example.com');
                                    setPassword('password123');
                                }}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all group"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[20px]">school</span>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-primary">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('facilitator@example.com');
                                    setPassword('password123');
                                }}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-facilitator-primary hover:bg-facilitator-primary/5 transition-all group"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-facilitator-primary transition-colors text-[20px]">cast_for_education</span>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-facilitator-primary">Facilitator</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('admin@example.com');
                                    setPassword('password123');
                                }}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-admin-primary hover:bg-admin-primary/5 transition-all group"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-admin-primary transition-colors text-[20px]">domain</span>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-admin-primary">Inst.</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('admin@typespire.com');
                                    setPassword('password123');
                                    setInstitution(''); // Clear institution for Super Admin
                                }}
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 transition-colors text-[20px]">admin_panel_settings</span>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-500">Admin</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
