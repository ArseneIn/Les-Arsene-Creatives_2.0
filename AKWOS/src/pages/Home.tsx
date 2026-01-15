import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <header className="relative w-full h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/images/home/hero-women.jpg"
                    alt="Group of diverse female athletes smiling together outdoors"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold tracking-widest uppercase mb-6">
                            Organization of Women in Sports
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight drop-shadow-lg">
                            <span className="text-secondary">Empowering</span> Through Sports & Education,<br />
                            Leading Through Change.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
                            AKWOS is a Rwandan non-profit that uses the power of sport to transform lives, build confidence, and foster equality on and off the field.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/impact" className="px-8 py-4 bg-secondary text-[#0d121b] font-bold rounded-full shadow-xl hover:bg-yellow-400 hover:scale-105 transition-all duration-300">
                                See Our Impact
                            </Link>
                            <button onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/50 text-white font-bold rounded-full hover:bg-white hover:text-[#0d121b] transition-all duration-300 cursor-pointer">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Partners Marquee */}
            <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 py-10 overflow-hidden relative">
                <div className="container mx-auto px-6 mb-6">
                    <p className="text-center text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Our Global & Local Partners</p>
                </div>
                <div className="relative flex overflow-x-hidden group">
                    <div className="flex animate-scroll whitespace-nowrap items-center gap-16 md:gap-24 px-8">
                        {[
                            { name: "Ministry of Sports", src: "/images/partners/minisports.png", height: "h-16 md:h-24" },
                            { name: "MIGEPROF", src: "/images/partners/migeprof-new.png", height: "h-16 md:h-24" },
                            { name: "CECI", src: "/images/partners/ceci.png", height: "h-16 md:h-24" },
                            { name: "Kvinna till Kvinna", src: "/images/partners/kvinna.png", height: "h-16 md:h-24" },
                            { name: "PLAY International", src: "/images/partners/play.png", height: "h-16 md:h-24" },
                            { name: "SOL Foundation", src: "/images/partners/sol.png", height: "h-16 md:h-24" },
                            { name: "WIHOGORA", src: "/images/partners/wihogora.png", height: "h-16 md:h-24" },
                            // Duplicating for marquee effect
                            { name: "Ministry of Sports", src: "/images/partners/minisports.png", height: "h-16 md:h-24" },
                            { name: "MIGEPROF", src: "/images/partners/migeprof-new.png", height: "h-16 md:h-24" },
                            { name: "CECI", src: "/images/partners/ceci.png", height: "h-16 md:h-24" },
                            { name: "Kvinna till Kvinna", src: "/images/partners/kvinna.png", height: "h-16 md:h-24" },
                            { name: "PLAY International", src: "/images/partners/play.png", height: "h-16 md:h-24" },
                            { name: "SOL Foundation", src: "/images/partners/sol.png", height: "h-16 md:h-24" },
                            { name: "WIHOGORA", src: "/images/partners/wihogora.png", height: "h-16 md:h-24" },
                        ].map((partner, index) => (
                            <div key={index} className="flex items-center justify-center px-6 min-w-[200px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <img src={partner.src} alt={partner.name} className={`${partner.height} w-auto object-contain`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-background-dark relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-200 dark:divide-gray-700 text-center">
                        {[
                            { count: "10,000+", label: "Community Members Reached" },
                            { count: "250", label: "Women Sports Leaders Trained" },
                            { count: "53", label: "Sports Clubs Created & Supported" },
                            { count: "31", label: "Youth Academies Empowered" },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-4 group">
                                <h3 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 group-hover:scale-110 transition-transform">{stat.count}</h3>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About & Mission Section */}
            <section id="mission" className="py-20 bg-surface-light dark:bg-surface-dark scroll-mt-20">
                <div className="container mx-auto px-6">
                    {/* Empowering Women Through Sports */}
                    <div className="max-w-6xl mx-auto mb-24">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            {/* Left: Heading & Origin */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold text-xs uppercase tracking-wider w-fit">
                                        <span className="material-symbols-outlined text-sm">history_edu</span> Est. 1998
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                                        Empowering Women <br />
                                        <span className="text-primary relative inline-block">
                                            Through Sports
                                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-secondary" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C29.5002 -1.00003 162.5 -2.00003 198 2.99997C203.833 3.66663 216 5.49997 197 6.49998" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                        </span>
                                    </h2>
                                </div>

                                <p className="text-xl text-gray-600 dark:text-slate-300 font-medium leading-relaxed">
                                    AKWOS (Organization of Women in Sports) is a pioneering Rwandan non-profit founded by Félicité Rwemarika.
                                </p>

                                <div className="bg-white dark:bg-[#1a2332] p-6 rounded-xl border-l-4 border-secondary shadow-sm">
                                    <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
                                        "Born from a vision of healing and empowerment after the Genocide against the Tutsi, AKWOS uses sports as a catalyst for social transformation, unity, and leadership among women and girls."
                                    </p>
                                </div>
                            </div>

                            {/* Right: The 'Why' & 'How' */}
                            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                                <div className="bg-white dark:bg-[#1a2332] p-8 md:p-10 rounded-2xl shadow-xl relative z-10 border border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                            <span className="material-symbols-outlined text-2xl">sports_soccer</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Belief</h3>
                                    </div>

                                    <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                                        At AKWOS, we believe in the transformative power of sports. Our mission is to create a supportive environment where Rwandan women and girls can thrive.
                                    </p>

                                    <ul className="space-y-4">
                                        {[
                                            "Platform for personal growth & community leadership",
                                            "Breaking down barriers to inclusivity",
                                            "Uplifting communities through the spirit of sports",
                                            "Ensuring every girl has the opportunity to shine"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4 group">
                                                <div className="mt-1 min-w-[20px]">
                                                    <span className="material-symbols-outlined text-green-500 text-xl group-hover:scale-110 transition-transform">check_circle</span>
                                                </div>
                                                <span className="text-gray-700 dark:text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                                            <span className="material-symbols-outlined">groups</span>
                                            <span>Join us to inspire change</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Mission */}
                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-lg border-t-4 border-primary hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="material-symbols-outlined text-4xl text-primary p-3 bg-primary/10 rounded-full">flag</span>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
                            </div>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                To inspire and enable women and girls to reach their full potential through sports, education, and leadership, building equality and lasting peace in their communities.
                            </p>
                        </div>
                        {/* Vision */}
                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-lg border-t-4 border-secondary hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="material-symbols-outlined text-4xl text-secondary p-3 bg-secondary/10 rounded-full">visibility</span>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
                            </div>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                A world where women and girls have equal access to opportunities, sports, and education enabling them to lead, thrive, and drive community transformation.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div>
                        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Values</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { name: "Empowerment", icon: "self_improvement" },
                                { name: "Equality", icon: "balance" },
                                { name: "Community", icon: "diversity_3" },
                                { name: "Leadership", icon: "stars" },
                                { name: "Speed in Servicing", icon: "bolt" },
                                { name: "Truthfulness", icon: "verified" },
                            ].map((value, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-background-dark rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                                    <span className="material-symbols-outlined text-3xl text-primary mb-3">{value.icon}</span>
                                    <span className="font-bold text-sm text-center text-gray-800 dark:text-gray-200">{value.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Empowerment Section */}
            <section className="bg-white dark:bg-background-dark">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 h-[400px] md:h-[500px]">
                        <img
                            src="/images/home/empowerment-trophy.jpg"
                            alt="Women celebrating"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-primary text-white">
                        <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Empowerment</h3>
                        <p className="text-lg leading-relaxed mb-6 font-light">
                            We empower women and girls to build confidence, leadership, and equality on and off the field. Our workshops provide safe spaces for self-expression and growth.
                        </p>
                        <Link to="#" className="inline-flex items-center font-bold hover:text-secondary transition-colors group">
                            View Our Programs <span className="material-icons ml-2 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="bg-white dark:bg-background-dark">
                <div className="flex flex-col md:flex-row-reverse items-center">
                    <div className="w-full md:w-1/2 h-[400px] md:h-[500px]">
                        <img
                            src="/images/home/leadership-speaking.jpg"
                            alt="Woman speaking"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-surface-light dark:bg-surface-dark text-gray-800 dark:text-white">
                        <h3 className="text-2xl font-display font-bold mb-4 text-primary dark:text-blue-400">Leadership & Advocacy</h3>
                        <p className="text-lg leading-relaxed mb-6 text-gray-600 dark:text-gray-300">
                            Through training, mentorship, and community programmes, we create opportunities that strengthen families, promote peace, and inspire the next generation of leaders.
                        </p>
                        <Link to="#" className="inline-flex items-center font-bold text-primary dark:text-blue-400 hover:text-secondary transition-colors group">
                            Meet Our Leaders <span className="material-icons ml-2 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Next Generation Section */}
            <section className="w-full h-[500px] overflow-hidden relative">
                <img
                    src="/images/home/nextgen-youth.jpg"
                    alt="Team of young athletes"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end justify-center pb-12">
                    <div className="text-center text-white max-w-3xl px-6">
                        <h2 className="text-3xl font-display font-bold mb-2">Building The Next Generation</h2>
                        <p className="text-lg opacity-90">Cultivating resilience and teamwork in Rwanda's youth.</p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
                <div className="absolute top-10 left-10 text-primary/10 dark:text-white/5 font-serif text-[200px] leading-none select-none">“</div>
                <div className="absolute bottom-10 right-10 text-primary/10 dark:text-white/5 font-serif text-[200px] leading-none select-none rotate-180">“</div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-xl border-l-8 border-primary shadow-lg">
                        <div className="mb-6">
                            <i className="material-icons text-primary text-4xl">format_quote</i>
                        </div>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            Rwanda's youth are the heartbeat of our nation, yet systemic barriers still prevent many from reaching their full potential. Young women, in particular, often lack access to leadership pathways, safe spaces for self-expression, and mentors who look like them. These gaps don't just affect individuals—they stall the progress of entire communities.
                        </p>
                        <div className="w-20 h-1 bg-secondary mb-6"></div>
                        <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                            <span className="text-primary">AKWOS</span> bridges this divide.
                        </p>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                            By leveraging the universal language of sport, we break the cycle of inequality. We don't just build athletes; we cultivate leaders, health advocates, and agents of peace who transform a "game" into a movement for social justice.
                        </p>
                    </div>
                    <div className="w-full flex justify-center mt-12">
                        <hr className="w-1/3 border-gray-300 dark:border-gray-700" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Make a Difference Today</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Your support helps us provide equipment, training, and mentorship to thousands of young women across Rwanda.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-secondary text-primary font-bold text-lg rounded-full shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all">
                            Donate Now
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all">
                            Become a Partner
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
