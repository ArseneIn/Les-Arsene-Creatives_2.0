import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { isAxiosError } from 'axios';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#061824] p-4 font-display text-center">
                <div className="bg-white dark:bg-[#0b1e2d] p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 dark:border-white/5">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Reset Link</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">The password reset link is missing or invalid. Please request a new one.</p>
                    <Link to="/login" className="inline-block bg-[#094A71] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#094A71]/90 transition-colors">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error(err);
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to reset password. The link may have expired.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#061824] p-4 font-display">
            <div className="bg-white dark:bg-[#0b1e2d] p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 dark:border-white/5">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6 bg-[#33B974]/10 text-[#33B974] px-4 py-1.5 rounded-full border border-[#33B974]/20">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Account Recovery</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Password</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Please enter your new password below to regain access to your account.
                    </p>
                </div>

                {success ? (
                    <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-50 dark:bg-[#33B974]/10 text-[#33B974] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Your password has been successfully updated. Redirecting you to login...
                        </p>
                        <Link to="/login" className="text-[#094A71] hover:underline font-bold text-sm">
                            Click here if you are not redirected automatically
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="flex flex-col gap-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium flex items-start gap-2">
                                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#094A71] outline-none text-sm"
                                    required
                                    minLength={8}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <Eye className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#094A71] outline-none text-sm"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Resetting...' : 'Save New Password'}
                        </button>

                        <div className="text-center mt-2">
                            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                Cancel and return to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
