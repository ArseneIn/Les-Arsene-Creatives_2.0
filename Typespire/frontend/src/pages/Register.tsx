import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                email,
                password,
                firstName,
                lastName,
                // Institution ID would typically be selected or determined by a code
                // For now, we'll assume it's handled or optional in the backend for basic registration
            });

            // Redirect to login on success
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
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
                        <h2 className="text-3xl font-bold leading-tight mb-4">Join the <span className="text-primary">Typing Revolution</span></h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            Create your account to start tracking your progress, competing with peers, and mastering professional typing skills.
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
                        <p className="text-slate-200 italic text-sm mb-3">"I improved my typing speed by 40 WPM in just two weeks. Typespire is incredible!"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 bg-[url('https://randomuser.me/api/portraits/men/32.jpg')] bg-cover"></div>
                            <div>
                                <p className="font-bold text-sm">David Kim</p>
                                <p className="text-xs text-slate-400">Student, MIT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
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
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create an account</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your details to get started.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Email Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john.doe@example.com"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
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
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">lock_reset</span>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
