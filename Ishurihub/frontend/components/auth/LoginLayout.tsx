"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";

interface LoginLayoutProps {
    title: string;
    role?: string; // e.g. 'student', 'parent', 'teacher', 'super_admin'
    themeColor: string; // e.g. 'bg-blue-600', 'bg-green-600'
    illustration?: string; // URLor path to image
    description?: string;
    allowSuperAdmin?: boolean;
}

export default function LoginLayout({ title, role, themeColor, description, allowSuperAdmin = false, illustration }: LoginLayoutProps) {
    const router = useRouter();
    const { login } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const redirectPath = await login(formData.email, formData.password);

            if (redirectPath) {
                const storedUser = localStorage.getItem("ishurihub_user");
                if (storedUser) {
                    const user = JSON.parse(storedUser);

                    if (user.roleId === 'super_admin' && !allowSuperAdmin) {
                        setError("Access Denied. Super Admins must use the Admin Portal.");
                        setIsLoading(false);
                        return;
                    }

                    if (role && user.roleId !== role && user.role?.name?.toLowerCase() !== role.toLowerCase()) {
                        if (role === 'student' && user.roleId !== 'student') {
                            setError(`Access Denied. This portal is for Students only.`);
                            setIsLoading(false);
                            return;
                        }
                        if (role === 'parent' && user.roleId !== 'parent') {
                            setError(`Access Denied. This portal is for Parents only.`);
                            setIsLoading(false);
                            return;
                        }
                        if (role === 'teacher' && user.roleId !== 'teacher' && user.role?.name !== 'Teacher') {
                            setError(`Access Denied. This portal is for Teachers only.`);
                            setIsLoading(false);
                            return;
                        }
                    }
                }

                router.push(redirectPath);
            } else {
                setError("Invalid email or password. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    const bgColorClass = themeColor.startsWith('bg-') ? themeColor : `bg-${themeColor}`;

    // Static lookup for gradients to ensure Tailwind generates the classes
    const gradientMap: Record<string, string> = {
        'bg-blue-600': 'from-blue-600/30 via-blue-600/60 to-blue-600',
        'bg-emerald-600': 'from-emerald-600/30 via-emerald-600/60 to-emerald-600',
        'bg-purple-600': 'from-purple-600/30 via-purple-600/60 to-purple-600',
        'bg-slate-900': 'from-slate-900/30 via-slate-900/60 to-slate-900',
    };

    const gradientClass = gradientMap[bgColorClass] || 'from-blue-600/30 via-blue-600/60 to-blue-600';


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] dark:bg-[#0f172a] p-4 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] ${bgColorClass}/5 rounded-full blur-3xl`}></div>
                <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] ${bgColorClass}/5 rounded-full blur-3xl`}></div>
            </div>

            <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white dark:bg-[#1e2536] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10">

                {/* Left Side - Form */}
                <div className="p-10 flex flex-col justify-center relative">
                    {/* Mobile Image Banner */}
                    {illustration && (
                        <div className="md:hidden absolute top-0 left-0 w-full h-32 overflow-hidden z-0">
                            <Image
                                src={illustration}
                                alt="Mobile Banner"
                                fill
                                className="object-cover object-top opacity-90"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-white dark:from-[#1e2536] to-transparent`}></div>
                            {/* Fixed Mobile Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass} mix-blend-multiply opacity-40`}></div>
                        </div>
                    )}

                    {/* Back Button */}
                    <Link
                        href="/login"
                        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm font-medium z-20"
                    >
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </div>
                        <span className="md:inline hidden">Back</span>
                    </Link>

                    <div className="mb-8 mt-24 md:mt-6 relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`size-10 ${bgColorClass}/10 rounded-xl flex items-center justify-center text-primary`}>
                                <span className="material-symbols-outlined text-[24px]">school</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Ishuri<span className="text-primary">Hub</span></span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{description || "Please enter your details to access the portal."}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151b2b] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-[#1e2536] outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock_key</span>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151b2b] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-[#1e2536] outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3.5 px-4 ${bgColorClass} text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
                            >
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            By signing in, you agree to our <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a>
                        </p>
                    </div>
                </div>

                {/* Right Side - Realistic Layout */}
                <div className={`hidden md:flex flex-col relative text-white p-10 justify-end overflow-hidden isolate`}>

                    {/* Background Image */}
                    {illustration && (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={illustration}
                                alt="Background"
                                fill
                                className="object-cover object-top opacity-90 mix-blend-overlay"
                                priority
                            />
                            {/* Gradient Overlay: Clearer top, darker bottom for text readability */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass} via-50% mix-blend-multiply`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        </div>
                    )}

                    {!illustration && (
                        <div className={`absolute inset-0 z-0 ${bgColorClass}`}></div>
                    )}

                    {/* Top Badge */}
                    <div className="absolute top-10 left-10 z-20">
                        <div className="inline-flex py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold shadow-lg">
                            Secure Portal
                        </div>
                    </div>

                    {/* Bottom Content - Moved down to clear faces */}
                    <div className="relative z-20 space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold leading-tight mb-3 drop-shadow-lg text-white">
                                {role === 'student' ? 'Welcome, Scholar!' :
                                    role === 'teacher' ? 'Inspiring Minds' :
                                        role === 'parent' ? 'Partner in Growth' :
                                            role === 'super_admin' ? 'System Control' : title}
                            </h2>
                            <p className="text-white/90 text-base leading-relaxed drop-shadow-md max-w-[90%]">
                                {description || "Complete digital transformation for modern education."}
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/15 transition-colors w-fit">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="size-7 rounded-full border-2 border-white/40 bg-gray-300" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 15}')`, backgroundSize: 'cover' }}></div>
                                ))}
                            </div>
                            <div>
                                <p className="font-bold text-xs">Trusted by Schools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
