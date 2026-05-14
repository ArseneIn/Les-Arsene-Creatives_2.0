'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Store, User, Lock, Eye, EyeOff, Phone, Mail, Globe, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import PhoneInput from '@/components/ui/PhoneInput';
import PageLoader from '@/components/ui/PageLoader';

export default function LoginForm() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const pathname = usePathname();

    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+250');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [approvalRequest, setApprovalRequest] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isNavigating, setIsNavigating] = useState(false);

    const { showToast } = useToast();

    // Language Switching Logic
    const currentLocale = pathname.split('/')[1] || 'en';
    const toggleLanguage = () => {
        const newLocale = currentLocale === 'en' ? 'rw' : 'en';
        const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
        router.push(newPath);
    };

    useEffect(() => {
        // Prevent redirects if we are already in the middle of a login process
        if (loading || approvalRequest) return;

        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr && userStr !== 'undefined') {
            try {
                const user = JSON.parse(userStr);
                // Only redirect if we are actually on the login page to avoid interference with AuthGuard
                if (pathname.includes('/login')) {
                    if (user.role === 'SUPERADMIN') {
                        router.replace(`/${currentLocale}/admin`);
                    } else if (user.role === 'MERCHANT' || user.role === 'CASHIER') {
                        router.replace(`/${currentLocale}/merchant`);
                    }
                }
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, [router, currentLocale, pathname, loading, approvalRequest]);

    // Handle polling for approval status
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (approvalRequest) {
            interval = setInterval(async () => {
                try {
                    const status = await api.get(`/auth/login/status/${approvalRequest.loginRequestId}`) as any;
                    if (status.access_token) {
                        clearInterval(interval);
                        localStorage.setItem('token', status.access_token);
                        localStorage.setItem('user', JSON.stringify(status.user));
                        showToast('Login approved!', 'success');
                        router.push(`/${currentLocale}/merchant`);
                    } else if (status.status === 'REJECTED' || status.status === 'EXPIRED') {
                        clearInterval(interval);
                        setApprovalRequest(null);
                        setError(status.status === 'REJECTED' ? 'Login request denied by merchant.' : 'Login request expired.');
                    }
                } catch (err: any) {
                    clearInterval(interval);
                    setApprovalRequest(null);
                    setError(err.message || 'Login request denied or expired.');
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [approvalRequest, currentLocale, router, showToast]);

    // Handle timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (approvalRequest && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && approvalRequest) {
            setApprovalRequest(null);
            setError('Login request expired.');
        }
        return () => clearInterval(timer);
    }, [approvalRequest, timeLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Format phone number with country code if using phone login
            const formattedPhone = loginMethod === 'phone'
                ? `${countryCode}${phone.replace(/^0+/, '')}` // Remove leading zeros
                : '';

            const payload = loginMethod === 'email'
                ? { email, password }
                : { phone: formattedPhone, pin };

            const data = await api.post<any>('/auth/login', payload);

            if (data.status === 'REQUIRES_APPROVAL') {
                setApprovalRequest(data);
                setTimeLeft(300);
                showToast('Approval required from merchant.', 'info');
                return;
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showToast('Login successful!', 'success');

            if (data.user?.role === 'SUPERADMIN') {
                router.push(`/${currentLocale}/admin`);
            } else if (data.user?.role === 'MERCHANT' || data.user?.role === 'CASHIER') {
                router.push(`/${currentLocale}/merchant`);
            } else {
                router.push(`/${currentLocale}`);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const message = err.message || 'Invalid credentials';
            setError(message);
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterNav = () => {
        setIsNavigating(true);
        router.push(`/${currentLocale}/register`);
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            {isNavigating && <PageLoader isManual={true} />}
            {/* Language Switcher */}
            <button
                onClick={toggleLanguage}
                className="absolute top-0 right-0 -mt-12 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-jet hover:bg-platinum-100 transition-colors"
            >
                <Globe className="w-4 h-4" />
                {currentLocale === 'en' ? 'Kinyarwanda' : 'English'}
            </button>

            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gold rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-gold/20">
                    <Store className="w-10 h-10 text-onyx" />
                </div>
                <h1 className="text-3xl font-bold text-onyx mb-2 font-heading">{t('welcome')}!</h1>
                <p className="text-gray-500 font-medium">{t('subtitle')}</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100/50">
                {approvalRequest ? (
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <Clock className="w-12 h-12 text-gold animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold text-onyx mb-2">Waiting for Approval</h2>
                        <p className="text-gray-500 mb-6">
                            Your login request has been sent to the shop owner. Please wait.
                        </p>
                        <div className="text-3xl font-bold font-heading text-onyx mb-8">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <button
                            onClick={() => setApprovalRequest(null)}
                            className="text-gray-500 hover:text-jet font-medium"
                        >
                            Cancel Login
                        </button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-5">
                    {loginMethod === 'email' ? (
                        <>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('email')}
                                    required
                                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-jet transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('password')}
                                    required
                                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors z-10">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <PhoneInput
                                    value={phone}
                                    onChange={(val, isValid) => {
                                        setPhone(val);
                                        setIsPhoneValid(isValid);
                                    }}
                                    countryCode={countryCode}
                                    onCountryChange={setCountryCode}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder={t('pin')}
                                    maxLength={4}
                                    required
                                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium tracking-widest"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <button type="button" className="text-sm font-medium text-gray-500 hover:text-jet transition-colors">
                            {t('recovery')}
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (loginMethod === 'phone' && !isPhoneValid)}
                        className="w-full bg-gold hover:bg-gold-400 text-onyx font-bold py-4 rounded-2xl shadow-lg shadow-gold/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? '...' : t('login')}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">{t('orContinue')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-medium ${loginMethod === 'email'
                                ? 'border-gold bg-gold/10 text-jet'
                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                }`}
                        >
                            <Mail className="w-5 h-5" />
                            {t('email')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-medium ${loginMethod === 'phone'
                                ? 'border-gold bg-gold/10 text-jet'
                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                }`}
                        >
                            <Phone className="w-5 h-5" />
                            {t('phone')}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        {t('notMember')}{' '}
                        <button 
                            type="button" 
                            onClick={handleRegisterNav}
                            className="text-gold hover:text-gold-600 font-bold transition-colors"
                        >
                            {t('register')}
                        </button>
                    </p>
                </div>
                </>
                )}
            </div>
        </div>
    );
}
