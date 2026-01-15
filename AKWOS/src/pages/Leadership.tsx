
import { useState } from 'react';

const boardMembers = [
    {
        name: "Félicité Rwemarika",
        role: "President & Legal Representative",
        image: "/images/team/felicite.jpg",
        bio: `Felicite is the Founder, President and Legal Representative of the Organization of Women in Sports (AKWOS). She is a women’s rights activist, entrepreneur, and member of the International Olympic Committee. Her work focuses on raising awareness for gender equality in sports and using sports as a tool for conflict resolution and economic empowerment.

Felicite has contributed in various capacities as a board member of the International Women’s Organisation (Women Win); Executive and Advisor of the Rwanda National Olympic and Sports Committee (RNOSC); Vice President of the Rwanda National Olympic Committee; President for the Women’s Football Commission in the Rwandan Football Federation (FERWAFA) and a member of the Rwanda Women and Sports Commission.

Felicite is also currently the Chairperson of “We Act for Hope” NGO as well as the Rwanda NGO Forum on HIV & AIDS and Health Promotion, a national network of 127 national NGOs working in the health sector.

Over the years, Felicite has organized 3 International Conferences on Gender Equality through Sport for Social Change. She was also the main speaker on Unity and Reconciliation through Sports at the American University of Nigeria. She has also organised workshops and seminars to raise awareness and promote sport as a powerful tool for peace-building, conflict resolution, gender equality, and economic empowerment, starting in schools and other communities.

Felicite was selected as and made an Ashoka Fellow in 2012; Awarded by the Stars Foundation and from Girls Collective in 2015 as well as conferred upon the International Olympic Committee (IOC) Award for Women and Sport on the African continent in 2016.

Felicite is a Member of the International Olympic Committee and a member of the following commissions: Sport and Active Society Commission (2017-2021); Olympism 365 (2022-); Gender Equality, Diversity and Inclusion (2022-); Delegate Member for Sport for Persons with Disabilities (2022-); Board member of the Olympic Refugee Foundation.

Felicite holds a Diploma in Business Administration from the Cambridge Tutorial College, UK and a Diploma in Nursing from the Mulago School of Nursing in Uganda.`
    },
    {
        name: "Odile Mwangaza",
        role: "1st Vice President & 2nd Legal Representative",
        image: "/images/team/odile.png",
        bio: `Odile has been an active and committed advocate for women's rights. From 2003 to 2024, she served as the vice president of AKWOS (Organization of Women in Sports), an organization dedicated to empowering women in Rwanda through education, training, and advocacy. In this leadership capacity, she worked on issues ranging from gender-based violence to women’s economic empowerment, tirelessly pushing for policies and programs that better support women’s rights and gender equality in Rwanda.

Odile is a distinguished professional whose career has been dedicated to supporting vulnerable populations, particularly those affected by trauma, HIV/AIDS, and gender-based violence. With a wealth of experience in trauma counseling, legal advice, and social work, she has emerged as a compassionate and effective advocate for individuals and communities facing some of the most significant challenges in Rwanda. Through her career and civic engagement, Odile has not only helped individuals heal but has also contributed to systemic changes that support human rights and gender equality.

Her advocacy also extended to the regional level, where she served as a member of COCAFEM/GL (Coalition of Women’s Associations in the Great Lakes Region) from 2019 to 2022. COCAFEM/GL is a key platform for women's organizations in the Great Lakes Region, where Odile’s leadership helped strengthen cross-border collaboration and advocacy for the rights of women in the region. Through her involvement, she contributed to important conversations and initiatives aimed at ending gender-based violence, ensuring better legal protections for women, and supporting women’s full participation in peace-building efforts.

Odile’s dedication to women’s rights and gender justice was evident in her early leadership roles as well. In 2003, she became the representative of AKWOS in the Nyamirambo District, where she worked at the grassroots level to engage women in advocacy efforts, raise awareness of their rights, and build support networks. Her work also extended to Njyanama, where she was a member of this local women’s group, helping to strengthen community-based efforts to improve the lives of women and families in her district.

Odile’s academic and professional qualifications reflect her commitment to lifelong learning and self-improvement. She holds a Bachelor’s degree in Law from the Université Laïque Adventiste de Kigali (UNILAK), where she graduated in 2008. This academic background has provided her with the legal expertise necessary to navigate the complex legal issues affecting women, particularly in cases involving sexual violence and HIV/AIDS. Her training in law has complemented her work in social services, enabling her to offer both legal counseling and trauma care in a holistic and integrated manner.

In addition to her formal education, Odile has pursued various specialized training programs that have enriched her professional skills. These include certifications in Human Rights, Women’s and Children’s Rights, Counseling for Women Victims of Sexual Violence, and HIV/AIDS Prevention and Counseling (including VCT and PrEP). Her training in Information Collection and her proficiency in Microsoft Word and Excel demonstrate her adaptability and readiness to apply technology in her advocacy and social work efforts. Furthermore, her engagement with LGBTQ+ awareness and integration highlights her understanding of the need for inclusive support and rights protection for all marginalized groups.`
    },
    {
        name: "Margaret Bonabana Baingana",
        role: "2nd Vice President & Legal Advisor",
        image: "/images/team/margaret.png",
        bio: `Margaret is a Co-Founder and Managing Partner of Shield Associates law firm in Kigali-Rwanda. She has broad and extensive experience in corporate governance and commercial/business transactions. Her focus is on corporate and commercial transactions covering company, investment, sports, fund advisory, tax, Intellectual Property, and labor laws.

Margaret has over 22 years of experience working for Government and International Organizations in the justice, health, and education sectors as well as in private legal practice in Rwanda.

Margaret currently serves as the 2nd Vice President of the Board of Organization of Women in Sports (AKWOS). She is also a Trustee on the International Bar Association (IBA) Board of Trustees, as well as a member of the Board of Ecobank Rwanda. Margaret is an outstanding member of the Rwanda Bar Association, the East Africa Law Society, and Rwanda Leader’s Fellowship.

She is passionate about mentoring young women professionals to maximize their potential and to live a balanced life while making tangible contributions to their communities. She is a wife, a mother of three and an active member of her community.

Margaret holds a Bachelor of Laws degree from Makerere University, Kampala, Uganda; a Post-graduate Diploma in Legal Practice from the Uganda Law Development Center; a Masters of Law degree in Government Law and Public Policy (LLM) from the University of the Pacific-McGeorge School of Law in California and holds several professional certificates.`
    },
    {
        name: "Brenda Mutesi",
        role: "Board Secretary",
        image: "/images/team/brenda.png",
        bio: `Brenda is a mature and self-driven learner who believes she is purposed to help organizations think through their options and get the most impact for their efforts. She is well acquainted in administrative support, excellent interpersonal relations, writing, phone and digital communications skills.

Brenda currently serves as the Secretary to the board of Organization of Women in Sports (AKWOS) where she is responsible for coordinating and organizing board meetings as well as distribution and follow-up on implementation of board resolutions.

Brenda is skilled in NGO and International Organizations management and work environments having had over 15 years’ experience working with organizations like UNFPA, GIZ Rwanda, Norwegian People’s Aid Rwanda, We Act Rwanda and the Private Sector Federation.

Brenda holds a Bachelor of Business Administration from the School of Finance and Banking, Rwanda.`
    },
    {
        name: "Gaspard Mujyambere",
        role: "Board Member, Finance Committee",
        image: "/images/team/gaspard.png",
        bio: `Gaspard is a results-driven and seasoned professional with over 20 years of experience in program management, finance, and project coordination within the international development sector. Adept at implementing strategic initiatives that drive sustainable development and positively impact vulnerable populations, particularly women and children. Currently serving on the board as Technical Advisor for Program and Finance at Organization of Women in Sport (AKWOS) thereby contributing to the organization’s growth in the sports sector and enhancing program effectiveness.

Gaspard successfully led the Ubuntu Care Project, preventing and addressing sexual violence against children with disabilities as a Project Manager at Federation Handicap International. He managed operational, administrative, financial, and programmatic aspects of the project, resulting in the successful implementation and benefitting over 65 children with justice and psychosocial support.

Gaspard has a proven track record as a Project Coordinator at Right to Play International Rwanda, where he collaborated with key stakeholders to integrate Play Based Learning (PBL) in the pre-service teacher training curriculum. Demonstrated proficiency in strategic planning, program development, and effective partnership building to achieve project objectives.

Gaspard brings a unique combination of skills, including strategic planning, financial management, project cycle management, and a strong commitment to human rights advocacy.

Gaspard holds a Master’s degree in Education Management and Administration from the University of Kigali and a Bachelor degree in Economics and Business Studies from Kigali Independent University.`
    },
    {
        name: "Charles Rugira",
        role: "Board Member, Internal Audit Committee",
        image: "/images/team/charles.png",
        bio: `Charles is a results-oriented, self-motivated food process technologist with over 13 years of progressive experience with diverse skills in process technology, food Production, food processing and manufacturing, processing lines design, process optimization and efficiency.

He has enormous experience in Food Safety and Management Systems (FSMS), New Product Development (NDP), Food Quality Assurance, Analysis and Control, Flow Technology, Milling Technology, Safety Health and Environment (SHE/OSH), ISO Standards, People and Conflict Management in a workplace with skills of performance measurement in different challenging positions. Charles also has a good background of technical sales and marketing skills, customer care relations and after sales service skills.

Charles is a committed research associate in social and economic development surveys such as quality improvement, gender integration, monitoring, learning and evaluation, knowledge management and community involvement. He is also exemplary at establishing public and interpersonal relations, developing advocacy and marketing programs with donors and stakeholders but especially the community-based programs for social behavioral change communication and service delivery.

Competent at program and project strategic designs, development, implementation, management, documenting and disseminating lessons learned through use of a data collection system that supports data use at source.

Charles currently serves as a board member at Organization of Women in Sports (AKWOS) where he also leads the Internal Audit Committee. He holds a Bachelor Degree in Food Science and Technology from the University of Rwanda.`
    },
    {
        name: "Yvonne Murebwayire",
        role: "Board Member",
        image: "/images/team/yvonne.png",
        bio: `Yvonne is currently the Managing Director of Care Flower Company, a horticulture venture based in Kigali, Rwanda. She has broad and extensive experience in business start-ups, growth and sustainability having started and supported many companies to scale over the years. Her major focus is on corporate governance, commercial transactions and sustainability of companies, investments as well as sports related ventures with over 15 years of experience in these fields.

Yvonne serves as board member for Association of Women in Sports (AKWOS), an organization whose main mission is to empower African women, starting from Rwanda, through sports and education.

Yvonne is also a board member of COPEDU PLC, a microfinance institution that provides financial services such as credits and savings to its customers. She is also an outstanding member of St. Peter’s Anglican Church of Rwanda Mothers Union.

Yvonne is passionate about mentoring young women professionals to maximize their potential and to live a balanced life while making tangible contributions to their communities and country at large. She is a wife, a mother of four children and an active member of her local community.

Yvonne has a Post Graduate Diploma in Micro Finance and Project Management from UNATEC. She also holds an A2 Diploma in Inclusive Teaching as well as different coaching certificates in different disciplines including women’s football.`
    }
];

interface BoardMemberProps {
    name: string;
    role: string;
    image?: string;
    bio: string;
}

const BoardMemberCard = ({ name, role, image, bio }: BoardMemberProps) => {
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
                        style={{ backgroundImage: image ? 'url(' + image + ')' : 'none' }}
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
                                style={{ backgroundImage: image ? 'url(' + image + ')' : 'none' }}
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
    return (
        <div className="w-full flex flex-col items-center bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display">

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
            <section className="w-full flex justify-center py-16 bg-surface-light dark:bg-[#1a2332] border-y border-slate-100 dark:border-slate-800">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 gap-10">
                    <div className="flex flex-col gap-4 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 w-fit">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Governance</span>
                        </div>
                        <h2 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-bold leading-tight">Board of Directors</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            In adherence to good corporate governance principles, AKWOS activities are overseen by a competent and strong Board of Directors made up of 7 members.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {boardMembers.map((member, index) => (
                            <BoardMemberCard key={index} {...member} />
                        ))}
                    </div>
                </div>
            </section>

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
                        {[
                            {
                                name: "Neema Icyishatse",
                                role: "Programs Officer",
                                tags: ["Strategic Planning", "M&E"],
                                image: "/images/team/grace.png"
                            },
                            {
                                name: "Grace Ayimpaye",
                                role: "Finance Officer",
                                tags: ["Finance planning", "Administration"],
                                image: "/images/team/neema.png",
                                tagColor: "amber"
                            },
                            {
                                name: "Godelieve Mujawabega",
                                role: "Field & Logistics Officer",
                                tags: ["Grant Mgmt", "Compliance"],
                                image: "/images/team/godelieve.png"
                            },
                            {
                                name: "Christine Bongera",
                                role: "Field Officer",
                                tags: ["Sports Coordinator", "Community"],
                                image: "/images/team/christine.png",
                                tagColor: "blue"
                            }
                        ].map((member, idx) => (
                            <div key={idx} className="group flex flex-col bg-[#f8f9fc] dark:bg-[#1a2332] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div
                                    className="aspect-[4/5] w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url("${member.image}")` }}
                                ></div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div>
                                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">{member.name}</h3>
                                        <p className="text-primary text-sm font-medium">{member.role}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {member.tags.map((tag, i) => (
                                            <span key={i} className={`px-2 py-1 ${member.tagColor === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : member.tagColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} text-xs rounded-full font-medium`}>
                                                {tag}
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
