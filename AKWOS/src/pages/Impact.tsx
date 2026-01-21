export const Impact = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Page Heading & Intro */}
            <section className="w-full py-12 md:py-20 bg-surface-light dark:bg-surface-dark">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-12">
                        <h5 className="text-secondary font-bold tracking-wider uppercase text-sm mb-3">2023-2024 Impact Dashboard</h5>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary-light dark:text-text-primary-dark leading-tight tracking-[-0.02em] mb-4">
                            Driving Change Through <span className="text-primary">Sports</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                            AKWOS leverages the power of sports to empower women and girls across Rwanda. Here is the tangible impact of our collective efforts.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Stat Card 1 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">diversity_1</span>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">Empowerment</p>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-5xl md:text-6xl font-black text-primary tracking-tight">10,000</span>
                                        <span className="text-3xl font-bold text-accent-gold">+</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Girls Empowered</p>
                                    <p className="text-sm text-text-secondary-light mt-1">Through leadership & sports programs</p>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">location_on</span>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">Reach</p>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-5xl md:text-6xl font-black text-primary tracking-tight">7</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Districts Reached</p>
                                    <p className="text-sm text-text-secondary-light mt-1">Including Gatsibo & Ngoma</p>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">history_edu</span>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">Consistency</p>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-5xl md:text-6xl font-black text-primary tracking-tight">20</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Years of Legacy</p>
                                    <p className="text-sm text-text-secondary-light mt-1">Building sustainable change</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="w-full py-16 bg-white dark:bg-[#151b2b]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Map Graphic */}
                        <div className="w-full lg:w-1/2 relative">
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                            <div className="relative bg-background-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
                                <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800 rounded-lg relative overflow-hidden group">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4TIIRerIFOJIppTGHjK4PajTawA32au9it_72MwIL7b0vdHqB2hXmj1fMD_mVJhvjbfEFKg88yihcNdM_WMfqxp6gbPtXUzAiaj2LiId1_33VmX_pAEM9Mko4-tWmDjAGvmS4zglSuuqCdp8zECfG2DHMB-mq36nkNvNdU_kWOgVddiUzYqDyH7_EHghgfskgccS6gkRy29Z8bqAWsROdq1ds-BHuGCkJ3b5SaFDJJe3MV-FAG_q95J8uQ7YMAxtp8qINnyEF46c"
                                        alt="Map of Rwanda"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Interactive Elements Overlay */}
                                    <div className="absolute top-1/3 right-1/4 group/pin">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-accent-gold rounded-full animate-ping absolute"></div>
                                            <div className="w-4 h-4 bg-primary border-2 border-white rounded-full relative z-10 shadow-lg cursor-pointer"></div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-surface-dark text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                                                <strong>Gatsibo District</strong><br />1,200 Girls
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1/3 right-1/3 group/pin">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-primary border-2 border-white rounded-full relative z-10 shadow-lg cursor-pointer hover:bg-accent-gold transition-colors"></div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-surface-dark text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                                                <strong>Ngoma District</strong><br />New Training Hub
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold shadow-sm">
                                        Interactive Coverage Map
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Context Text */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                    <span className="material-symbols-outlined text-sm">public</span>
                                    Geographic Focus
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                                    Scaling Impact Across Rwanda
                                </h2>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg leading-relaxed mb-6">
                                    From the rolling hills of Gatsibo to the vibrant communities of Ngoma, our programs are tailored to local needs. We are expanding our footprint to ensure no girl is left on the sidelines.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex gap-4 items-start p-4 rounded-xl bg-background-light dark:bg-surface-dark border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark">Gatsibo</h4>
                                        <p className="text-sm text-text-secondary-light">Leadership academies launched in 12 schools.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start p-4 rounded-xl bg-background-light dark:bg-surface-dark border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <span className="material-symbols-outlined">sports_soccer</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark">Ngoma</h4>
                                        <p className="text-sm text-text-secondary-light">Regional tournament finals host.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors group">
                                    View Full Region Report
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Human Centered Stories Section */}
            <section className="w-full py-20 bg-background-light dark:bg-background-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#135bec 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 items-center">
                        {/* Text Side */}
                        <div className="w-full md:w-1/2 order-2 md:order-1">
                            <span className="text-accent-gold font-bold uppercase tracking-wider text-sm mb-2 block">Human-Centered Stories</span>
                            <h2 className="text-3xl md:text-4xl font-black text-text-primary-light dark:text-text-primary-dark mb-8 leading-tight">
                                More Than Just a Game.<br />
                                <span className="text-primary">A Platform to Lead.</span>
                            </h2>
                            <blockquote className="relative border-l-4 border-accent-gold pl-6 py-2 mb-8">
                                <p className="text-xl md:text-2xl font-serif italic text-text-primary-light dark:text-text-primary-dark leading-relaxed mb-4">
                                    "Sports gave me a voice; AKWOS gave me the platform to lead. Before, I was shy to speak up. Now, I coach 50 girls every weekend."
                                </p>
                                <footer className="flex items-center gap-3">
                                    <div className="w-8 h-[1px] bg-gray-400"></div>
                                    <div>
                                        <cite className="not-italic font-bold text-primary block">Coach Grace Nyinawumuntu</cite>
                                        <span className="text-sm text-text-secondary-light">Head Coach & Mentor, Kigali</span>
                                    </div>
                                </footer>
                            </blockquote>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 text-sm font-bold text-white transition-all hover:bg-primary-dark shadow-md hover:shadow-lg">
                                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    Support Our Work
                                </button>
                                <button className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-6 text-sm font-bold text-text-primary-light dark:text-text-primary-dark transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    Download Impact Report
                                </button>
                            </div>
                        </div>
                        {/* Image Side */}
                        <div className="w-full md:w-1/2 order-1 md:order-2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5] group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10"></div>
                                <img
                                    src={`${import.meta.env.BASE_URL}images/impact-hero.jpg`}
                                    alt="Coach Grace"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                    <div className="flex justify-between items-end">
                                        <div className="text-white">
                                            <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">Field Stories</p>
                                            <p className="font-bold text-lg">Grace's Journey</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined">play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="w-full py-16 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-2xl p-8 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-gold opacity-20 rounded-full -translate-x-1/3 translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div className="max-w-xl">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Join the Movement</h3>
                                <p className="text-blue-100 text-sm md:text-base">Get quarterly updates on our projects in Rwanda and learn how you can help us reach the next 10,000 girls.</p>
                            </div>
                            <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
                                <input className="h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-full md:w-64" placeholder="Enter your email" type="email" />
                                <button className="h-12 px-6 rounded-lg bg-white text-primary font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
