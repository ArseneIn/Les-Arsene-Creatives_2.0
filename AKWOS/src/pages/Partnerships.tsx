import { useState, useEffect } from 'react';
import { initialPartners, PartnerItem } from '../data/partners';
import { getApiUrl } from '../utils/apiConfig';

export const Partnerships = () => {
    const [partners, setPartners] = useState<PartnerItem[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch(getApiUrl('partners.php'));
                const data = await response.json();
                if (Array.isArray(data)) {
                    const formattedPartners = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        logo: item.logo_url,
                        website: item.website_url
                    }));
                    setPartners(formattedPartners);
                }
            } catch (error) {
                console.error("Failed to fetch partners:", error);
                setPartners(initialPartners);
            }
        };

        fetchPartners();
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6ir9P_d4vAIm_o5VZ8OFiYfOoJxCNLhcLgdMyRUpm19fSPftj5OomxqbIt-r_sF67sJZT8VsItbjCyQk1zqLDewf2gHa3hmGxtvbv3VRjxaF4hOt1s0W-wlXBdC8ZTJVUmc6fvEnqyY4hG0ydMJtpginEMBPYXh2V3lT41NQCEuGOLwYaaNBdRlBIX0MCRCvhWHmzt13S-iDwunnIEavaMHgZa0H5O5mKB8G4kQJLFs_vMRYKIe0EUYElAnQgGBuPfQrgCA-yCW4")' }}
                    ></div>
                </div>
                <div className="relative z-20 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Global Strategic Initiative</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                            Collaborating for Collective Impact: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Partner with AKWOS</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl font-light">
                            Empowering women through sport across East Africa since 1998. Join us in driving sustainable development, gender equity, and institutional excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex items-center justify-center h-12 px-8 rounded bg-primary hover:bg-blue-700 text-white text-base font-bold transition-colors shadow-lg shadow-blue-900/20">
                                Explore Opportunities
                            </button>
                            <button className="flex items-center justify-center h-12 px-8 rounded border border-white/30 hover:bg-white/10 text-white text-base font-medium transition-colors backdrop-blur-sm">
                                View 2024 Impact Report
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Wall (Verified Partners) */}
            <section className="w-full py-16 bg-[#f8f9fc] dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Verified Institutional Partners</h2>
                        <div className="w-12 h-0.5 bg-yellow-500 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-12 items-center justify-items-center opacity-90">
                        {partners.map((partner) => (
                            <div key={partner.id} className="flex items-center justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title={partner.name}>
                                <img src={partner.logo} alt={partner.name} className="h-24 w-auto object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Strategic Pillars */}
            <section className="w-full py-24 bg-white dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0d121b] dark:text-white leading-tight mb-4">
                                Strategic Partnership Pillars
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Structured engagement opportunities designed for mutual value, measurable outcomes, and scalable institutional impact.
                            </p>
                        </div>
                        <button className="inline-flex items-center text-primary font-bold hover:underline">
                            Download Partnership Deck <span className="material-symbols-outlined ml-1 text-sm">arrow_outward</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Programmatic Funding", icon: "monetization_on", desc: "Direct capital investment into district-level sports programs achieving audited, measurable social outcomes in health and education." },
                            { title: "Technical Collaboration", icon: "handshake", desc: "Knowledge exchange, capacity building, and technical assistance to enhance operational efficiency and program delivery quality." },
                            { title: "Advocacy & Policy", icon: "gavel", desc: "Joint lobbying and high-level policy formation to entrench gender equity within national and regional sports legislation." }
                        ].map((pillar, idx) => (
                            <div key={idx} className="group flex flex-col p-8 rounded bg-[#f8f9fc] dark:bg-[#1a2332] border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                                <div className="w-14 h-14 rounded flex items-center justify-center bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#0d121b] dark:text-white mb-3">{pillar.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow">
                                    {pillar.desc}
                                </p>
                                <ul className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{idx === 0 ? "Restricted & Unrestricted Grants" : idx === 1 ? "M&E Framework Development" : "Legislative Review Panels"}</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{idx === 0 ? "Infrastructure Development" : idx === 1 ? "Staff Secondments & Training" : "Thought Leadership Summits"}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why AKWOS (Credibility Strip) */}
            <section className="w-full bg-primary text-white py-20 relative overflow-hidden">
                {/* Abstract Pattern Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/20">
                        {[
                            { val: "25+", label: "Years of Legacy", desc: "Pioneering women's sports development in East Africa since 1998.", icon: "history_edu" },
                            { val: "30", label: "Districts Reached", desc: "Achieving true grassroots scale with nationwide coverage across Rwanda.", icon: "map" },
                            { val: "100%", label: "Audit Compliance", desc: "Fully audited financials and international safeguarding standards certified.", icon: "verified_user" }
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
                                <div className="mb-4 text-yellow-500">
                                    <span className="material-symbols-outlined text-5xl">{stat.icon}</span>
                                </div>
                                <h4 className="text-5xl font-black tracking-tight mb-2">{stat.val}</h4>
                                <p className="text-lg font-medium text-white/90">{stat.label}</p>
                                <p className="text-sm text-white/60 mt-2 max-w-xs">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High-Level Contact Form */}
            <section className="w-full py-24 bg-[#f8f9fc] dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Text Content */}
                        <div className="lg:w-1/3">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded mb-4">Contact</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0d121b] dark:text-white leading-tight mb-6">
                                Initiate a Strategic Dialogue
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                                We invite institutional leaders and development partners to discuss bespoke collaboration opportunities.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary mt-1">location_on</span>
                                    <div>
                                        <h4 className="font-bold text-[#0d121b] dark:text-white">Headquarters</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Remera, Kigali, Rwanda<br />KG 11 Ave, Building 4</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary mt-1">mail</span>
                                    <div>
                                        <h4 className="font-bold text-[#0d121b] dark:text-white">Partnerships Office</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">partnerships@akwos.org</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Form */}
                        <div className="lg:w-2/3 bg-white dark:bg-[#1a2332] p-8 md:p-10 rounded border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-none">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="name">Full Name</label>
                                    <input className="h-11 px-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full" id="name" placeholder="e.g. Dr. Jane Smith" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="email">Work Email</label>
                                    <input className="h-11 px-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full" id="email" placeholder="jane@organization.org" type="email" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="org">Organization Name</label>
                                    <input className="h-11 px-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full" id="org" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="title">Job Title</label>
                                    <input className="h-11 px-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full" id="title" type="text" />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="interest">Area of Interest</label>
                                    <select className="h-11 px-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full" id="interest">
                                        <option disabled selected value="">Select an area...</option>
                                        <option value="funding">Programmatic Funding</option>
                                        <option value="technical">Technical Collaboration</option>
                                        <option value="policy">Advocacy & Policy</option>
                                        <option value="other">Other Inquiry</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="message">Brief Message</label>
                                    <textarea className="p-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:border-primary focus:ring-primary w-full resize-none" id="message" rows={4}></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <button className="w-full md:w-auto min-w-[200px] h-12 flex items-center justify-center rounded bg-primary text-white font-bold text-base hover:bg-blue-700 transition-colors shadow-md" type="submit">
                                        Submit Inquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
