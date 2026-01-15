export const Founder = () => {
    return (
        <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white overflow-x-hidden font-display">

            {/* Hero Section */}
            <section className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Portrait */}
                    <div className="relative w-full aspect-[4/5] lg:aspect-square overflow-hidden rounded-2xl shadow-2xl order-1 lg:order-1">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay z-10"></div>
                        <div
                            className="w-full h-full bg-top bg-cover bg-no-repeat transform hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ backgroundImage: 'url("/images/team/felicite.jpg")' }}
                        ></div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-6 order-2 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 w-fit">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Leadership Profile</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0d121b] dark:text-white leading-[1.1] tracking-tight">
                            Felicite Rwemarika: A Global Voice for <span className="text-primary">Gender Equality</span>
                        </h1>
                        <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                            As an IOC Member, Ashoka Fellow, and Founder of AKWOS, Felicite has dedicated her life to empowering women through sports to create lasting social change across Rwanda and beyond.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="flex items-center justify-center h-12 px-6 rounded-lg bg-primary hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 group">
                                <span className="material-symbols-outlined mr-2 text-[20px] group-hover:scale-110 transition-transform">connect_without_contact</span>
                                Connect on LinkedIn
                            </button>
                            <button className="flex items-center justify-center h-12 px-6 rounded-lg border-2 border-[#e7ebf3] dark:border-gray-700 hover:border-primary text-[#0d121b] dark:text-white font-bold bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <span className="material-symbols-outlined mr-2 text-[20px]">download</span>
                                Download Full Bio
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roles & Affiliations */}
            <section className="w-full bg-white dark:bg-[#151c2b] py-16">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col gap-10">
                    <div className="flex flex-col gap-2 border-l-4 border-yellow-500 pl-4">
                        <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">Roles & Global Affiliations</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Driving policy and governance at the highest levels of sport.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "verified_user", title: "IOC Member", org: "International Olympic Committee" },
                            { icon: "diversity_1", title: "Board Member", org: "Olympic Refuge Foundation" },
                            { icon: "public", title: "Advisor", org: "Global Observatory" },
                            { icon: "sports_martial_arts", title: "Council Member", org: "World Taekwondo" },
                        ].map((role, idx) => (
                            <div key={idx} className="group flex flex-col items-center justify-center p-8 bg-[#f8f9fc] dark:bg-[#1a2234] rounded-xl border border-transparent hover:border-primary/20 transition-all hover:shadow-lg">
                                <div className="h-16 w-16 mb-4 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-5xl">{role.icon}</span>
                                </div>
                                <h3 className="font-bold text-center text-lg mb-1">{role.title}</h3>
                                <p className="text-xs text-center text-gray-500 uppercase tracking-wide">{role.org}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Awards Timeline */}
            <section className="w-full py-20 bg-background-light dark:bg-background-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="max-w-[1280px] mx-auto px-4 md:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold text-[#0d121b] dark:text-white mb-4">Recognition of Impact</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Celebrating decades of dedication to women's rights and sports development.</p>
                        </div>
                        <a className="text-primary font-bold hover:text-blue-700 flex items-center gap-1" href="#">
                            View all awards <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    {/* Timeline Component */}
                    <div className="relative">
                        <div className="hidden md:block absolute top-[22px] left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
                            {[
                                { year: "2012", title: "Ashoka Fellow", desc: "Recognized for pioneering the use of sports as a tool for economic empowerment and healing in post-genocide Rwanda.", icon: "emoji_events", color: "bg-yellow-500", text: "text-yellow-500" },
                                { year: "2016", title: "IOC Women and Sport Award", desc: "Honored internationally for her outstanding contribution to promoting the development and participation of women and girls in sport.", icon: "trophy", color: "bg-primary", text: "text-primary" },
                                { year: "2018", title: "AIMF Award", desc: "Acknowledged by the Association Internationale des Maires Francophones for social innovation.", icon: "star", color: "bg-yellow-500", text: "text-yellow-500" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 group">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 border-white dark:border-[#101622] ${item.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform relative z-10`}>
                                        <span className="material-symbols-outlined text-white text-xl">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`${item.text} font-bold text-lg mb-1`}>{item.year}</span>
                                        <h3 className="font-bold text-xl text-[#0d121b] dark:text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured In */}
            <section className="w-full py-12 border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151c2b]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center gap-8">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Featured In</span>
                    <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16 w-full opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                            <span className="material-symbols-outlined text-3xl">language</span>
                            <span className="text-xl font-bold font-serif">UN News</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                            <span className="material-symbols-outlined text-3xl">play_circle</span>
                            <span className="text-xl font-bold italic">Al Jazeera</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                            <span className="material-symbols-outlined text-3xl">newspaper</span>
                            <span className="text-xl font-bold">Times of Africa</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                            <span className="material-symbols-outlined text-3xl">feed</span>
                            <span className="text-xl font-bold font-mono">The New Times</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Transition */}
            <section className="w-full bg-primary relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
                <div className="relative z-10 max-w-[960px] mx-auto px-4 text-center flex flex-col items-center gap-8">
                    <span className="material-symbols-outlined text-6xl text-yellow-500 mb-2">format_quote</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Felicite's vision powers the <span className="text-yellow-500">AKWOS</span> mission.
                    </h2>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Join us in transforming lives through the power of sport. Discover the team behind the movement and our unique approach to development.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white hover:bg-gray-100 text-primary text-base font-bold shadow-xl transition-all hover:-translate-y-1">
                            Meet the Team
                        </button>
                        <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white text-white text-base font-bold transition-all">
                            How We Work
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
