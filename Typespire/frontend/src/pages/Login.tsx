import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-[#122017] min-h-screen flex flex-col font-sans text-gray-900 dark:text-white">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white dark:bg-[#1a2e21] border-b border-gray-100 dark:border-[#2a4535] px-6 lg:px-40 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 text-secondary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                            <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Typespire</h1>
                </div>
                <button className="bg-secondary/10 text-gray-900 dark:text-secondary dark:bg-secondary/20 hover:bg-secondary/30 transition-colors px-4 py-2 rounded-lg text-sm font-bold">
                    Register Institution
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent">
                <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Branding and Context */}
                    <div className="hidden lg:flex flex-col gap-6">
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-white/20">
                            <div
                                className="w-full h-full bg-cover bg-center flex items-end p-8"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, transparent, #0e1a13), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhnWrm2Hf6ryalUesMTEHP2X1XsgL-_mTq-syVLgntw5j8VE1cOJyXQIkYlvI9sgJ5_Cv2c4d3Q8ColLefQLLD7-fGJRK_aFGPFLRc_6fOhzt3Rv0fXavoHai_5JKBpOsPCG2vnocc14A_sYYFv2qMVNo36q5ExmNc4d_IW1EZaqCZEmnVr5vF1GntsdLdGjjAfsXjl2tBVuUAtqhqJWkKV5HbGlrrQpoOeQvoae1SI2-B5EOkNWt7CIuT53qFnM7cIDx0PSgwTCL6')`
                                }}
                            >
                                <div>
                                    <span className="text-secondary font-bold text-sm tracking-widest uppercase">Institutional Portal</span>
                                    <h2 className="text-white text-3xl font-black mt-2">Powering Academic Typing Excellence.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-900 dark:text-white text-lg font-medium">Trusted by leading universities worldwide.</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Access your personalized typing dashboard, track speed progress, and manage institutional certifications in one place.</p>
                        </div>
                    </div>

                    {/* Right Side: Login Card */}
                    <div className="bg-white dark:bg-[#1a2e21] shadow-2xl rounded-xl p-8 lg:p-10 border border-gray-100 dark:border-[#2a4535]">
                        <div className="mb-8">
                            <h2 className="text-[#0e1a13] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Welcome Back</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-base mt-2">Select your institution to continue.</p>
                        </div>
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            {/* Institution Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#0e1a13] dark:text-white text-sm font-semibold flex items-center gap-2">
                                    <span className="text-secondary text-lg">🏛️</span>
                                    Select Institution
                                </label>
                                <select className="appearance-none w-full rounded-lg text-[#0e1a13] dark:text-white focus:ring-2 focus:ring-secondary focus:border-secondary border border-gray-200 dark:border-[#2a4535] bg-gray-50 dark:bg-[#122017] h-14 px-4 text-base font-normal">
                                    <option disabled defaultValue="">Search for your college...</option>
                                    <option value="kepler">Kepler College</option>
                                    <option value="mit">MIT (Massachusetts Institute of Technology)</option>
                                    <option value="stanford">Stanford University</option>
                                    <option value="oxford">University of Oxford</option>
                                </select>
                            </div>

                            {/* Identity Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#0e1a13] dark:text-white text-sm font-semibold flex items-center gap-2">
                                    <span className="text-secondary text-lg">👤</span>
                                    Student ID or Staff Email
                                </label>
                                <input
                                    className="w-full rounded-lg text-[#0e1a13] dark:text-white focus:ring-2 focus:ring-secondary focus:border-secondary border border-gray-200 dark:border-[#2a4535] bg-gray-50 dark:bg-[#122017] h-14 px-4 placeholder:text-gray-400 text-base font-normal"
                                    placeholder="e.g. s12345@kepler.edu"
                                    type="text"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[#0e1a13] dark:text-white text-sm font-semibold flex items-center gap-2">
                                        <span className="text-secondary text-lg">🔒</span>
                                        Password
                                    </label>
                                    <a className="text-secondary text-xs font-bold hover:underline" href="#">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg text-[#0e1a13] dark:text-white focus:ring-2 focus:ring-secondary focus:border-secondary border border-gray-200 dark:border-[#2a4535] bg-gray-50 dark:bg-[#122017] h-14 px-4 placeholder:text-gray-400 text-base font-normal"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" type="button">
                                        <span className="text-xl">👁️</span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2 py-1">
                                <input
                                    className="w-4 h-4 rounded text-secondary focus:ring-secondary border-gray-200 dark:border-[#2a4535] dark:bg-[#122017]"
                                    id="remember"
                                    type="checkbox"
                                />
                                <label className="text-sm text-gray-500 dark:text-gray-400 font-medium cursor-pointer" htmlFor="remember">Remember my institution</label>
                            </div>

                            {/* Submit Button */}
                            <Link to="/" className="w-full bg-secondary hover:bg-green-600 transition-all transform hover:scale-[1.01] active:scale-[0.98] text-white h-14 rounded-lg font-black text-lg shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
                                Login to Portal
                                <span className="font-bold">→</span>
                            </Link>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2a4535] text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                New to Typespire? <a className="text-[#0e1a13] dark:text-white font-bold hover:underline" href="#">Create a personal account</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 px-10 border-t border-gray-100 dark:border-[#2a4535] flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 dark:text-gray-400 text-xs">© 2024 Typespire Academic SaaS. All rights reserved.</p>
                <div className="flex gap-6">
                    <a className="text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
                    <a className="text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors" href="#">Terms of Service</a>
                    <a className="text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors" href="#">Institutional Support</a>
                </div>
            </footer>
        </div>
    );
};

export default Login;
