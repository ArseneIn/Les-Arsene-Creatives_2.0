import { Link } from 'react-router-dom';

export const Resources = () => {
    return (
        <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-white pb-20">

            <div className="w-full max-w-[1200px] px-4 md:px-10 lg:px-40">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 pt-6 pb-2 text-sm">
                    <Link to="/" className="text-[#4c669a] dark:text-gray-400 font-medium hover:text-primary transition-colors">Home</Link>
                    <span className="text-[#4c669a] dark:text-gray-500">/</span>
                    <span className="text-[#0d121b] dark:text-white font-medium">Resources</span>
                </div>

                {/* Page Heading */}
                <div className="py-6">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">AKWOS Knowledge & Impact Hub</h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-base md:text-lg font-normal leading-normal max-w-3xl">Access our latest research, annual reports, and strategic policy documents driving gender equity in sports.</p>
                    </div>
                </div>

                {/* Hero Section: Featured Report */}
                <div className="mt-4 mb-12 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-[#e7ebf3] dark:border-gray-700 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div
                            className="w-full md:w-2/5 h-64 md:h-auto bg-cover bg-center bg-no-repeat relative group"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsQ34G5vMgJlOmqyOSU5fEBkeWZiLQqalwrbTSFTFJgCT89-tKaDPn-xgobC-sXoKzOegUVmsXtY1zt5-mn5tIw5Q1lFBkCSVpx6jexRAfzczsVgin7j21xt6FQl0CM8xNuczOCkAaNcqffG6XrCXjY3x9iao6dKNmhypYlO24r1MoQ63DhBOluVn-GmT4q2rVzYYMmf1kIYoRqGCyDF70JlkFcjoJYHfuw2cRHuPG9zq06AUV540CWcyg4rFS3eiE5hAaWqkEzqI")' }}
                        >
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
                        </div>
                        <div className="flex flex-col justify-center p-8 md:p-10 md:w-3/5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-bold rounded uppercase tracking-wider">Latest Publication</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">October 2024</span>
                            </div>
                            <h2 className="text-[#0d121b] dark:text-white text-2xl md:text-3xl font-bold leading-tight mb-4">
                                2024 Annual Impact Report: Advancing Gender Equity
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-base mb-8 leading-relaxed">
                                Our comprehensive analysis of sports development programs in Rwanda, highlighting key milestones in female participation, leadership development, and community outreach initiatives across 15 districts.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    <span>Download PDF (2.4 MB)</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-[#0d121b] dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span>Read Executive Summary</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area Layout: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white dark:bg-[#1a202c] rounded-lg border border-[#e7ebf3] dark:border-gray-700 p-4">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
                            <nav className="flex flex-col space-y-1">
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold text-sm" href="#">
                                    <span className="material-symbols-outlined text-[20px]">folder_open</span>
                                    All Resources
                                </a>
                                {[
                                    { label: "Annual Reports", icon: "bar_chart" },
                                    { label: "Strategic Plans", icon: "flag" },
                                    { label: "Policy Briefs", icon: "policy" },
                                    { label: "Newsletter Archive", icon: "mail" }
                                ].map((item, idx) => (
                                    <a key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition-colors" href="#">
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        {/* Newsletter Mini Module */}
                        <div className="mt-6 bg-primary rounded-lg p-5 text-white shadow-md">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined">mark_email_unread</span>
                                <h3 className="font-bold text-sm">Stay Updated</h3>
                            </div>
                            <p className="text-xs text-blue-100 mb-4 leading-relaxed">Get the latest policy briefs and impact reports directly to your inbox.</p>
                            <form className="flex flex-col gap-2">
                                <input className="w-full text-sm px-3 py-2 rounded border-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-white/50" placeholder="Your email address" type="email" />
                                <button className="w-full bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold py-2 rounded transition-colors uppercase tracking-wide">Subscribe</button>
                            </form>
                        </div>
                    </aside>

                    {/* Right Column: Search & Grid */}
                    <div className="flex-1 w-full">
                        {/* Search & Filter Bar */}
                        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-lg border border-[#e7ebf3] dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                            <div className="relative w-full md:max-w-md">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined">search</span>
                                </span>
                                <input className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder:text-gray-400" placeholder="Search documents, research, or topics..." type="text" />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                                <select className="py-2.5 pl-3 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 cursor-pointer min-w-[120px]">
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Oldest</option>
                                    <option>Sort by: A-Z</option>
                                </select>
                                <select className="py-2.5 pl-3 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 cursor-pointer min-w-[120px]">
                                    <option>Topic: All</option>
                                    <option>Gender Equity</option>
                                    <option>Youth Sports</option>
                                    <option>Health</option>
                                </select>
                            </div>
                        </div>

                        {/* Resource Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[
                                { title: "Rwanda National Sports Policy Review", year: "2023", type: "Policy Brief", size: "1.8 MB", ext: "PDF", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdAkibs4s_207DpEY-c3ajai3rpXuDR5bb7f4QB080YK7SjYth33HzaHWNq0m6U2aKPwDQbdAEiJ-F0zl6OaHjSOABaMhNL7Auqvfq6TZF3C8-_NdLMJLnFGiBNQdyYZnL9oUiJhYTSsmvqYWW0s1auRKIdI4JZN4PgM34u3DXw99QfV0lts0FXwKNZM2UiVs1G0KvHLTCtUwlTGqw0xaU1oEcJu3x61DBm0-aam_7KEXADt4LQ38RKNFTZjjbSX-RNfmsVGz8h4", color: "text-red-500" },
                                { title: "5-Year Strategic Roadmap: Vision 2025", year: "2020-2025", type: "Strategic Plan", size: "4.2 MB", ext: "PDF", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvrVVInnQwpLmykgjqoW3upVfcV2Ot1-TNGRGYZ4EK0aVZErNax1SeHAg3pH_TOVnPxxjmfq8jX8nlJT-9Ko0DJYvSmxEHUzeDTxOJW04567tK5ue-wnDYS-cs3-nNIG4PxK-sHtNKEaZazYCbBYLsK1DHVUbUelCGTHloBqVg_VbpxWcpiKU9fbrUpHwYok3v1ECNq0gu4kpTQl0RfSoiz04HPFmhE3M6otEO2mh_x1HitUqlDDmIS_rThBNhYQe7XexYcTs1bhw", color: "text-red-500" },
                                { title: "Girl's Participation in Football: A Case Study", year: "2022", type: "Research", size: "3.5 MB", ext: "PDF", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjOuGyvtKjL4yX1L9iskXDaBMxMMLUW0QX60V2C17cr2veija_OxAswgx3ro80MQkLn01RTHLPw3UqcFwiNlY-6yDn1_XNxwWoJqexHG60Z-0lwEiY6xg52rIWLb1_XaiE0z0VMH6MP9U5wfk05KIEamCphw4gGfCxwfxTsIFOkdr_yi4ULbf8r5bZ0ie_57K_N0y99vK9VGa4QlI3NDWIsKY9JTBega114_eO-CM-ss7TBzYUmGhKjq7P7ERsVPhw7uI2-NVkzuU", color: "text-red-500" },
                                { title: "2022 Annual Impact Report", year: "2022", type: "Annual Report", size: "5.1 MB", ext: "PDF", image: "", gradient: "bg-gradient-to-tr from-blue-900 to-primary", color: "text-red-500" },
                                { title: "Partnership Announcement: FIFA Foundation", year: "2023", type: "Press Release", size: "120 KB", ext: "DOCX", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvzR2D47YH5XLYrgpJax9BV5-bHDRbhGPcqVJcnamixqucyhXB8eusnk06sovcDcqEqKs-4kt-F6Lnd2EmVS9hV_fxl7ob8MgzWK2C7V-UJMjUYE0uYBnq6vZZ-t2X2WT4o6XCdIObhPhVG5sdrcZSyeU3_p01qAk8g5JK0WpJdabKz6irACVBrYjwth5zIuqGh_qFxKdmcil6Gl9l6mPlfYn43tyYnH6MV3mC_irgi9YnSC_UQbCuyz9ZI50YcV7BFz0FZ7syxHU", color: "text-green-600" },
                                { title: "2021 Annual Impact Report", year: "2021", type: "Annual Report", size: "3.8 MB", ext: "PDF", image: "", gradient: "bg-gradient-to-br from-gray-200 to-gray-400", color: "text-red-500" }
                            ].map((res, idx) => (
                                <div key={idx} className="group flex flex-col bg-white dark:bg-[#1a202c] border border-[#e7ebf3] dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                                        {res.image ? (
                                            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply" style={{ backgroundImage: `url('${res.image}')` }}></div>
                                        ) : (
                                            <div className={`absolute inset-0 ${res.gradient} opacity-60`}></div>
                                        )}
                                        <div className="bg-white dark:bg-gray-900 p-3 rounded shadow-sm z-10 flex flex-col items-center gap-1 w-24 h-32 justify-center border border-gray-200 dark:border-gray-700">
                                            <span className={`material-symbols-outlined ${res.color} text-3xl`}>{res.ext === 'PDF' ? 'picture_as_pdf' : 'description'}</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{res.ext}</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{res.type}</span>
                                            <span className="text-xs text-gray-500">{res.year}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-[#0d121b] dark:text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                                            {res.title}
                                        </h3>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-xs text-gray-500 font-medium">{res.size}</span>
                                            <button className="text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-10">
                            <nav className="flex items-center gap-2">
                                <button className="flex items-center justify-center w-10 h-10 rounded border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 rounded bg-primary text-white font-bold text-sm">1</button>
                                <button className="flex items-center justify-center w-10 h-10 rounded border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">2</button>
                                <button className="flex items-center justify-center w-10 h-10 rounded border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">3</button>
                                <span className="px-2 text-gray-400">...</span>
                                <button className="flex items-center justify-center w-10 h-10 rounded border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
