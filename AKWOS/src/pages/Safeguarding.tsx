export const Safeguarding = () => {
    return (
        <div className="w-full bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-white transition-colors duration-200">

            {/* Quick Exit / Safety Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-center text-sm text-emerald-800 dark:text-emerald-100 font-medium">
                <div className="max-w-[1280px] mx-auto flex justify-between items-center">
                    <span className="flex items-center gap-2 justify-center w-full sm:w-auto">
                        <span className="material-symbols-outlined text-lg">lock</span>
                        This is a secure page. If you need to exit quickly, click the button.
                    </span>
                    <button className="hidden sm:flex items-center gap-1 text-xs bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors">
                        Quick Exit <span className="material-symbols-outlined text-sm">logout</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative flex w-full flex-col">
                <div className="flex justify-center w-full">
                    <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 py-6 md:py-10">
                        <div
                            className="relative overflow-hidden rounded-2xl min-h-[480px] flex flex-col items-center justify-center text-center p-8 md:p-16 gap-6 bg-cover bg-center"
                            style={{ backgroundImage: 'linear-gradient(rgba(19, 91, 236, 0.85), rgba(16, 22, 34, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPfhQ76U3VY35gl_UhGbZ0r-_Tbkpjs2ssYAVOzkZ3D3sujYz16pPprWdy2ad1OEIN_nmUziMEhxQcTaZmjDoUPnhHJZSe1oVUFbKTELzwLO3aX-FODrqIzJpOAS6VNkgaeLbeKOli4vu6h8IcrV6e4ODDMKnxpAO_odtSC6sEzRGwqKY6HvoEZtEw_oGn0l8gGRBHUTIf39o8SmxSQCDoHfFKqIft-39XENyKnbRLYOHhLXhK8CWgKig5yNm9NOOEpY276Llf9bU")' }}
                        >
                            <div className="flex flex-col gap-4 max-w-3xl z-10">
                                <div className="inline-flex items-center justify-center gap-2 self-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="material-symbols-outlined text-base">verified_user</span>
                                    Official Policy
                                </div>
                                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                    Our Commitment to Safety & Protection
                                </h1>
                                <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                                    Ensuring a safe, respectful, and empowering environment for every athlete, staff member, and partner. We maintain a zero-tolerance policy towards abuse and harassment.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center mt-4 z-10">
                                <a href="#policy-downloads" className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white hover:bg-gray-50 text-primary text-base font-bold transition-colors shadow-lg">
                                    Read Full Policy
                                </a>
                                <a href="#reporting" className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold transition-colors shadow-lg gap-2">
                                    <span className="material-symbols-outlined">report</span>
                                    Report an Incident
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Standards Alignment & Intro */}
            <div className="w-full bg-white dark:bg-[#101622]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row gap-10 items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-12">
                        <div className="md:w-2/3">
                            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Global Standards</h3>
                            <h2 className="text-[#0d121b] dark:text-white text-2xl md:text-3xl font-bold leading-tight mb-4">
                                Aligned with International Best Practices
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed">
                                Our safeguarding framework is rigorously designed to meet and exceed the standards set by the International Olympic Committee (IOC) and FIFA. We believe that sport should be a safe haven, and our protocols reflect our dedication to maintaining the highest levels of integrity and care.
                            </p>
                        </div>
                        <div className="md:w-1/3 flex justify-center md:justify-end gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-[#0d121b] dark:text-white">sports_soccer</span>
                                <span className="text-xs font-bold text-[#0d121b] dark:text-white">FIFA STANDARDS</span>
                            </div>
                            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-[#0d121b] dark:text-white">stars</span>
                                <span className="text-xs font-bold text-[#0d121b] dark:text-white">IOC FRAMEWORK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FeatureSection: Four Pillars */}
            <div className="w-full bg-background-light dark:bg-background-dark py-8">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-[#0d121b] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">The Four Pillars of Protection</h2>
                        <p className="text-slate-600 dark:text-gray-400 mt-2">Our comprehensive approach to keeping everyone safe.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "shield_lock", title: "Prevention", desc: "Rigorous vetting, mandatory training, and education programs to identify risks and stop abuse before it starts." },
                            { icon: "campaign", title: "Reporting", desc: "Safe, confidential, and accessible channels for raising concerns without fear of retaliation or judgment." },
                            { icon: "gavel", title: "Response", desc: "Immediate, fair, and trauma-informed investigation protocols strictly aligned with international legal standards." },
                            { icon: "volunteer_activism", title: "Support", desc: "Victim-centered care, access to professional counseling, and ongoing welfare checks for all involved parties." },
                        ].map((pillar, idx) => (
                            <div key={idx} className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151c2b] p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-2xl">{pillar.icon}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">{pillar.title}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTASection: Anonymous Reporting */}
            <div className="w-full py-16 md:py-24 px-4" id="reporting">
                <div className="max-w-[1000px] mx-auto">
                    <div className="relative overflow-hidden rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-8 md:p-12">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                            <div className="flex flex-col gap-4 md:w-2/3">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wide text-sm">
                                    <span className="material-symbols-outlined">security</span>
                                    Confidential & Secure
                                </div>
                                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">
                                    Anonymous Reporting
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">
                                    Your safety is our priority. If you have witnessed or experienced misconduct, you can report it securely and anonymously. We are here to listen, believe, and act.
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-lg text-emerald-500">check_circle</span>
                                        Encrypted
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-lg text-emerald-500">check_circle</span>
                                        24/7 Monitoring
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/3 w-full flex justify-center md:justify-end">
                                <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg py-4 px-8 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-none text-white text-lg font-bold transition-all transform hover:-translate-y-0.5">
                                    Report an Incident
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* ResourceSection: Downloads */}
            <div className="w-full bg-background-light dark:bg-background-dark py-16 border-t border-gray-200 dark:border-gray-800" id="policy-downloads">
                <div className="max-w-[800px] mx-auto px-4 md:px-10">
                    <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold leading-tight mb-8 text-center">Resource Downloads</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { title: "AKWOS Safeguarding Policy", info: "PDF • 2.4 MB • Updated Jan 2024", icon: "picture_as_pdf", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
                            { title: "Child Protection Code of Conduct", info: "PDF • 1.1 MB • Updated Dec 2023", icon: "picture_as_pdf", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
                            { title: "Incident Report Form (Printable)", info: "DOCX • 500 KB", icon: "description", color: "text-primary bg-blue-50 dark:bg-blue-900/20" },
                        ].map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 rounded-lg bg-white dark:bg-[#151c2b] border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-sm transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded flex items-center justify-center ${file.color}`}>
                                        <span className="material-symbols-outlined">{file.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#0d121b] dark:text-white font-bold text-base group-hover:text-primary transition-colors">{file.title}</span>
                                        <span className="text-slate-500 text-xs">{file.info}</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-500 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};
