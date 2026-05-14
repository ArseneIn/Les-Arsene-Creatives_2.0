'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { 
    User, Store, Lock, Eye, EyeOff, Mail, 
    Smartphone, Building, MapPin, Hash, Key,
    ChevronRight, ChevronLeft, CheckCircle2,
    Globe, ArrowLeft
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import PhoneInput from '@/components/ui/PhoneInput';

type Step = 1 | 2 | 3 | 'success';

export default function RegisterForm() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const pathname = usePathname();
    const { showToast } = useToast();

    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Personal Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+250');
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    // Step 2: Business Info
    const [businessName, setBusinessName] = useState('');
    const [tin, setTin] = useState('');
    const [address, setAddress] = useState('');

    // Step 3: Security
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);

    // Language Switching Logic
    const currentLocale = pathname.split('/')[1] || 'en';
    
    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!name || !phone) {
                setError('Name and Phone are required');
                return;
            }
            if (!isPhoneValid) {
                setError('Please enter a valid phone number');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!businessName) {
                setError('Business Name is required');
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        if (step === 3) setStep(2);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!pin || pin.length !== 4) {
            setError('PIN must be 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formattedPhone = `${countryCode}${phone.replace(/^0+/, '')}`;
            
            const registrationData = {
                name,
                email,
                phone: formattedPhone,
                business_name: businessName,
                tin,
                address,
                password,
                pin,
                role: 'MERCHANT'
            };

            await api.post('/auth/register', registrationData);
            
            setStep('success');
            showToast('Registration successful!', 'success');

            // Auto-login or redirect after delay
            setTimeout(() => {
                router.push(`/${currentLocale}/login`);
            }, 3000);

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
            showToast(err.message || 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-onyx mb-1">Account Holder</h2>
                <p className="text-gray-500 text-sm font-medium">Basic information to identify you.</p>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                    <User className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            <div className="relative group">
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
                    <Mail className="w-5 h-5" />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            {error && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <button
                type="button"
                onClick={handleNext}
                className="w-full bg-gold hover:bg-gold-400 text-onyx font-bold py-4 rounded-2xl shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
            >
                Next: Business Profile
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-onyx mb-1">Business Profile</h2>
                <p className="text-gray-500 text-sm font-medium">Details about your shop or company.</p>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                    <Building className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business Name"
                    required
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                    <Hash className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                    placeholder="TIN (Tax ID)"
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">
                    <MapPin className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Business Address"
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            {error && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-onyx font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-gold hover:bg-gold-400 text-onyx font-bold py-4 rounded-2xl shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
                >
                    Next: Security
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-onyx mb-1">Security & Access</h2>
                <p className="text-gray-500 text-sm font-medium">Set up your access credentials.</p>
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
                    placeholder="Portal Password (min. 6 chars)"
                    required
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium"
                />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-gray-400 hover:text-jet transition-colors focus:outline-none"
                    >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4-Digit POS PIN"
                    maxLength={4}
                    required
                    className="w-full bg-platinum-700/50 text-jet placeholder:text-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-medium tracking-widest"
                />
            </div>

            {error && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-onyx font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gold hover:bg-gold-400 text-onyx font-bold py-4 rounded-2xl shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-onyx border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            Complete Setup
                            <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    const renderSuccess = () => (
        <div className="text-center py-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-16 h-16 text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-onyx mb-3">Registration Successful!</h2>
            <p className="text-gray-500 font-medium mb-8">
                Welcome to Smart Curuza. We are setting up your workspace and redirecting you to the login...
            </p>
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );

    return (
        <div className="w-full max-w-md mx-auto relative">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gold rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-gold/20">
                    <Store className="w-8 h-8 text-onyx" />
                </div>
                <h1 className="text-2xl font-bold text-onyx font-heading">New Merchant Signup</h1>
                
                {/* Bold Progress Indicator */}
                {step !== 'success' && (
                    <div className="mt-10 mb-2 relative">
                        <div className="flex items-center justify-between">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex-1 relative">
                                    {/* Line connecting steps */}
                                    {s < 3 && (
                                        <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-100 z-0">
                                            <div 
                                                className="h-full bg-onyx transition-all duration-500 ease-out"
                                                style={{ width: step > (s as number) ? '100%' : step === s ? '0%' : '0%' }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div 
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                                                step === s 
                                                    ? 'bg-white border-gold text-onyx shadow-lg shadow-gold/20 scale-110' 
                                                    : step > (s as number)
                                                        ? 'bg-onyx border-onyx text-gold'
                                                        : 'bg-white border-gray-100 text-gray-300'
                                            }`}
                                        >
                                            {step > (s as number) ? (
                                                <CheckCircle2 className="w-6 h-6 animate-in zoom-in duration-300" />
                                            ) : (
                                                <span className="text-base font-bold">{s}</span>
                                            )}
                                        </div>
                                        <span className={`text-[11px] font-bold uppercase tracking-widest mt-3 transition-colors duration-300 ${
                                            step === s ? 'text-onyx' : 'text-gray-400'
                                        }`}>
                                            {s === 1 ? 'Profile' : s === 2 ? 'Shop' : 'Security'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100/50 min-h-[400px] flex flex-col justify-center">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 'success' && renderSuccess()}

                {step !== 'success' && (
                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-gray-400 text-sm font-medium">
                            Already have an account?{' '}
                            <button 
                                onClick={() => router.push(`/${currentLocale}/login`)}
                                className="text-gold hover:text-gold-600 font-bold transition-colors"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
            
            {/* Back to Login link */}
            {step === 1 && (
                <button 
                    onClick={() => router.push(`/${currentLocale}/login`)}
                    className="mt-6 flex items-center gap-2 text-gray-500 hover:text-onyx transition-colors mx-auto font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </button>
            )}
        </div>
    );
}
