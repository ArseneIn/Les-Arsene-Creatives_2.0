
import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiConfig';


// We retain the interface but update it to match potential API response slightly
interface TeamMember {
    id?: number;
    name: string;
    role: string;
    category: 'Board' | 'Operational' | 'Executive';
    image: string; // mapped from image_url
    bio?: string;
    tags?: string[]; // mapped from comma separated string
    tagColor?: string; // Logic to assign random color
}

// Board Member Card Component (Inner)
const BoardMemberCard = ({ name, role, image, bio }: TeamMember) => {
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when modal is open
    if (isOpen) {
        if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    } else {
        if (typeof document !== 'undefined') document.body.style.overflow = 'auto';
    }

    return (
        <>
            <div className={`flex flex-col gap-4 p-6 bg-white dark:bg-background-dark rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 h-full`}>
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <div
                        className={`h-16 w-16 rounded-full bg-gray-200 bg-cover bg-top shrink-0 flex items-center justify-center text-gray-400`}
                        style={{ backgroundImage: image ? 'url(' + getApiUrl(image) + ')' : 'none' }}
                    >
                        {!image && <span className="material-symbols-outlined text-3xl">person</span>}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#0d121b] dark:text-white line-clamp-1" title={name}>{name}</h3>
                        <p className="text-primary text-sm font-medium line-clamp-2" title={role}>{role}</p>
                    </div>
                </div>

                {/* Content Section (Preview) */}
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-4">
                    {bio}
                </div>

                <div className="mt-auto pt-2">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group"
                    >
                        Read Full Bio <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Image Side (Desktop) / Top (Mobile) */}
                        <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-800 relative min-h-[200px] md:min-h-full">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: image ? 'url(' + getApiUrl(image) + ')' : 'none' }}
                            >
                                {!image && (
                                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                                        <span className="material-symbols-outlined text-6xl">person</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">{name}</h2>
                                    <p className="text-primary font-medium text-lg">{role}</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-2xl text-slate-500">close</span>
                                </button>
                            </div>

                            <div className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line overflow-y-auto pr-2">
                                {bio}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const Leadership = () => {
    const [boardMembers, setBoardMembers] = useState<TeamMember[]>([]);
    const [operationalTeam, setOperationalTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(getApiUrl('team.php'));
                const data = await response.json();

                if (Array.isArray(data)) {
                    // Map backend fields to frontend interface
                    const formattedTeam = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        role: item.role,
                        category: item.category,
                        image: item.image_url,
                        bio: item.bio,
                        tags: item.tags ? item.tags.split(',') : [],
                        tagColor: 'blue' // Default color
                    }));

                    setBoardMembers(formattedTeam.filter((m: TeamMember) => m.category === 'Board'));
                    setOperationalTeam(formattedTeam.filter((m: TeamMember) => m.category === 'Operational'));
                }
            } catch (error) {
                console.error("Failed to fetch team:", error);
            }
        };

        fetchTeam();
    }, []);

    return (
        <div className="w-full flex flex-col items-center bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display">
            {/* ... Hero Section code (unchanged) ... */}
            {/* Hero Section */}
            <div className="w-full flex justify-center bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-[1280px]">
                    <div className="@container">
                        <div className="@[480px]:p-4">
                            <div
                                className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-8 relative overflow-hidden"
                                style={{ backgroundImage: 'linear-gradient(rgba(16, 22, 34, 0.4) 0%, rgba(16, 22, 34, 0.7) 100%), url("/images/team/leadership-hero.jpg")' }}
                            >
                                <div className="flex flex-col gap-4 text-center max-w-[800px] z-10">
                                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:leading-tight">
                                        The People Powering Change
                                    </h1>
                                    <h2 className="text-white/90 text-lg font-normal leading-relaxed max-w-[600px] mx-auto">
                                        From the pitch to the boardroom, meet the diverse team driving women's empowerment in Rwanda and beyond.
                                    </h2>
                                </div>
                                <div className="flex gap-4 z-10 pt-4">
                                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
                                        <span className="truncate">Join the Movement</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board of Directors Section */}
            {boardMembers.length > 0 && (
                <section className="w-full flex justify-center py-16 bg-surface-light dark:bg-[#1a2332] border-y border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 gap-10">
                        <div className="flex flex-col gap-4 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 w-fit">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Governance</span>
                            </div>
                            <h2 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-bold leading-tight">Board of Directors</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                In adherence to good corporate governance principles, AKWOS activities are overseen by a competent and strong Board of Directors made up of {boardMembers.length} members.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                            {boardMembers.map((member, index) => (
                                <BoardMemberCard key={index} {...member} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Operational Team Section */}
            <section className="w-full flex justify-center py-12 bg-white dark:bg-[#151c2a]">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 gap-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                        <div>
                            <h2 className="text-[#0d121b] dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">Program Experts & Field Officers</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">Our operational team brings diverse expertise in peace-building, sports management, and economic development to every project.</p>
                        </div>
                        <button className="text-primary font-bold text-sm hover:underline">View Organizational Chart</button>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {operationalTeam.map((member, idx) => (
                            <div key={idx} className="group flex flex-col bg-[#f8f9fc] dark:bg-[#1a2332] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div
                                    className="aspect-[4/5] w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url("${getApiUrl(member.image)}")` }}
                                >
                                    {!member.image && (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-300">
                                            <span className="material-symbols-outlined text-5xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div>
                                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">{member.name}</h3>
                                        <p className="text-primary text-sm font-medium">{member.role}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {member.tags && member.tags.map((tag, i) => (
                                            <span key={i} className={`px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium`}>
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-4 flex justify-end">
                                        <a href="#" className="text-slate-400 hover:text-[#0077b5] transition-colors bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm hover:shadow-md">
                                            <span className="material-symbols-outlined text-lg">link</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="w-full bg-[#101622] py-16 px-4">
                <div className="layout-container flex justify-center">
                    <div className="flex flex-col items-center text-center max-w-2xl gap-6">
                        <h2 className="text-white text-3xl md:text-4xl font-black tracking-[-0.033em]">Driving Global Impact Through Sport</h2>
                        <p className="text-slate-400 text-lg">
                            Join our mission to empower women and build peace in the Great Lakes region. Partner with our experts to create sustainable change.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                            <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors">
                                Partner With Us
                            </button>
                            <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-transparent border border-slate-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-800 transition-colors">
                                Contact Team
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
