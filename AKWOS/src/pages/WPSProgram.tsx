import { Link } from 'react-router-dom';
import { getAssetPath } from '../utils/assets';

export const WPSProgram = () => {
    return (
        <div className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
            {/* Breadcrumbs */}
            <div className="flex justify-center bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-[1200px] px-4 md:px-10 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link to="/" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Home</Link>
                        <span className="text-slate-400 text-sm">/</span>
                        <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Programs</a>
                        <span className="text-slate-400 text-sm">/</span>
                        <span className="text-slate-900 dark:text-white text-sm font-semibold">WPS</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="flex justify-center px-4 md:px-10 pb-8">
                <div className="w-full max-w-[1200px] @container">
                    <div className="rounded-2xl overflow-hidden shadow-lg relative min-h-[500px] flex flex-col justify-end">
                        {/* Hero Image Background */}
                        <div className="absolute inset-0 z-0">
                            <img
                                alt="Rwandan women in leadership circle"
                                className="w-full h-full object-cover"
                                src={`${import.meta.env.BASE_URL}images/programs/wps-program.jpg`}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
                        </div>
                        {/* Hero Content */}
                        <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                            <div className="flex flex-col gap-4">
                                <span className="text-yellow-600 font-bold tracking-wider text-sm uppercase">Program Focus</span>
                                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                                    Women, Peace and Security (WPS)
                                </h1>
                                <p className="text-slate-200 text-lg md:text-xl font-normal leading-relaxed max-w-2xl border-l-4 border-yellow-600 pl-4 mt-2">
                                    Empowering leadership through sport and dialogue in alignment with UNSCR 1325.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link to="/impact" className="flex items-center gap-2 h-12 px-6 rounded-lg bg-primary hover:bg-blue-600 transition-colors text-white text-base font-bold shadow-md inline-flex justify-center">
                                    <span>Explore Program Impact</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contextual Text Block (Partnership & UNSCR 1325) */}
            <section className="flex justify-center py-16 px-4 md:px-10 bg-white dark:bg-[#1a2230]">
                <div className="w-full max-w-[1200px] flex flex-col gap-12">
                    <div className="flex flex-col gap-4 max-w-[720px]">
                        <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">
                            Strategic Context
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            Our approach aligns international mandates with grassroots action, creating a sustainable ecosystem for peace.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-background-light dark:bg-slate-800 border-l-4 border-yellow-600 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Partnership with Kvinna till Kvinna</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                AKWOS maintains a robust strategic partnership with Kvinna till Kvinna, one of the world's leading women's rights organizations. Together, we leverage sports not just as a physical activity, but as a powerful, non-threatening vehicle for peacebuilding and dialogue. This collaboration ensures resources are directed effectively to empower women leaders at the community level.
                            </p>
                        </div>
                        {/* Right Column */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-background-light dark:bg-slate-800 border-l-4 border-primary shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-primary text-3xl">public</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">UNSCR 1325 Alignment</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Our programmatic framework is rigorously aligned with UN Security Council Resolution 1325. We implement the resolution's mandate by ensuring women's full and meaningful participation in peace processes within Rwanda. By translating high-level policy into community sport initiatives, we bridge the gap between international diplomacy and local reality.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Four Pillars */}
            <section className="flex justify-center py-16 px-4 md:px-10 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-[1200px] flex flex-col gap-10">
                    <div className="text-center max-w-2xl mx-auto mb-6">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Our Framework</span>
                        <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-4">
                            The Four Pillars
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            A holistic approach to sustainable peace and security.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Participation", icon: "groups", desc: "Promoting women's active role in decision-making processes at all levels of governance." },
                            { title: "Protection", icon: "shield", desc: "Ensuring safety and security for women and girls from gender-based violence." },
                            { title: "Prevention", icon: "warning", desc: "Strategies to prevent conflict and violence in communities through early warning systems." },
                            { title: "Relief & Recovery", icon: "medical_services", desc: "Supporting victims, providing health services, and rebuilding resilient communities." }
                        ].map((pillar, idx) => (
                            <div key={idx} className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-md">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">{pillar.icon}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">{pillar.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resource Download Section */}
            <section className="flex justify-center pb-20 pt-10 px-4 md:px-10 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-[960px]">
                    <div className="bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-5 w-full md:w-auto">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full text-primary shrink-0">
                                <span className="material-symbols-outlined text-3xl">description</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">2022 Assessment Final Report</h3>
                                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Public</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-normal">
                                    Comprehensive analysis of the WPS program impact across 5 districts in Rwanda. Includes key metrics and success stories.
                                </p>
                            </div>
                        </div>
                        <a href={getAssetPath("documents/AB-AKWOS-UNSCR-1325-Convening-Event-20250904-.pdf")} download className="w-full md:w-auto shrink-0 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                            <span className="material-symbols-outlined group-hover:animate-bounce">download</span>
                            <span>Download PDF</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
