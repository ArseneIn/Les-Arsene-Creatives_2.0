import { useState } from 'react';

export const SuccessStories = () => {
    const [filter, setFilter] = useState('All Stories');

    const filters = ['All Stories', 'Peace Makers', 'Economic Empowerment', 'WPS', 'Leadership'];

    const stories = [
        {
            title: "From the Pitch to the Boardroom: Odette’s Journey",
            date: "Nov 12, 2023",
            category: "Leadership",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZxD3upXsVdPvJ2Wn6RpoLX6PFZ6jDIue8ORNyWhOFhMDbytTrbLMSabqHYfi_n3SUnSxqnUd-nE_31CZj40TTtOlMIizyPalVfIeYJw8bjBOp3MweDfOKVPkHeJ9T5apgin-ZgDWPG_WeqRu3hpmZErQ9Pwu5iXQa7mj30CHhLq1UH84hdEjiju2uAna1oT0EJX6XawkQ7f7ENVzxJrYFK3I-vsLUtdNCrzerBOBJQsbDWGMcBNUudHuHqLGehqWGLaJPfqrlAQk",
            excerpt: "How a football captain utilized leadership training to launch a cooperative that now employs 30 women in her local village.",
            badge: "Community Leader"
        },
        {
            title: "Breaking Barriers in Agribusiness",
            date: "Oct 28, 2023",
            category: "Economic Empowerment",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxYn667pYOHoPRuw6mi0Y2yVFQVXXPMkUs4qO4sXOqwHJknx0XzyQK8DQ1ITt_920EWRhYV7mm7C-JiCF5FSWT2ndxRWsBiMo0qH2uzSfnrugOCoqjdlIRUltMjWS9UHJ6aW5YWFmx4XNfx-xWQ8HOF0HfbK-SmDpuKbojne84DiPh_-IMsHUFc32WkVrbcyYcf6kqg2vxbiIYOgkIEKmCNTKuvv1Y496lNE7yNktaLH1TQtxS9kGTgaNezRm2KXpUAmyY9ZF47Wg",
            excerpt: "Transforming subsistence farming into a thriving export business through financial literacy workshops and sports discipline.",
            badge: "150% Income Increase",
            badgeColor: "bg-primary text-white"
        },
        {
            title: "Healing Wounds Through Teamwork",
            date: "Oct 15, 2023",
            category: "Peace Makers",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0g7ALTIesLmVo1RUooqsfafX6YVzgwRPxWWAWvHNA1Zixu-tKpSmeW9Co21UX3M-VDpEQC4r2zEC76xdlDIq-kC9BCarDjcAOeOTaRN3Eq_2jH9c5iV8bwJfqTTek9yBb4D5oCIhDHPvCQN84NXFLhKHYUYjRKrQVRJrsTNeoJVeN5DMShlZBgR05Asr8dIMnZ5U4VH94mWNFg5zuzOixmwoX3sUnY74cvAqqhPCQI7AuUlRzdSJCQjqtaGPzJJBhS_HYh7g9V50",
            excerpt: "Rebuilding community trust after conflict through organized sports leagues that bring opposing sides together on the same pitch.",
            badge: "Peace Ambassador"
        },
        {
            title: "Leading the Charge for Education",
            date: "Sep 22, 2023",
            category: "WPS",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChGM2UGGL6lJ6XBFAsc-u_ksv9kp0xy-EuYA0HkDPpy7rIF50Vuu8xMsprOzeRmOWNgWMRQjq3MvyfLTXjEC8xHv4PymIPfb-Lb46F_2IV7QAWFJ6nUgn0QhqrzcWe2iuggq-BkWCLedF1cM42BoF-T5Ycs50p5tqiHd-oZnyMe8unyTX4AolFNznm4lyZMpGX0wjjqO1jVBJAGUBsT1VFJAUyO8fBuItBc8JhgjG_NesBmmjs0twtopmMVbf9dS6xlhN3mQ_SQBI",
            excerpt: "A young athlete uses her platform to advocate for girls' schooling in rural areas, securing funding for 2 new classrooms.",
            badge: "Education Advocate"
        },
        {
            title: "Sports as a Tool for Peace",
            date: "Aug 10, 2023",
            category: "Peace Makers",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf2k-QE8aOJz8KKF-mKksGetJJzARf6onx5qaHD3ff99Wqbnb1k8HcZLgUokaKE7lgraa9x0LFh3EYOBTHgfgpT_EO-8SUY_mY4KxFCDJIiGB3Mro8aAM9a_IsGTdVhg_PBWuM80S7UfdCbigHGZzgpcGXqLfUwL90xUg8qbrbJuFV2BYsBFmYYK2ovWMcOHGuWWrAILP6Y08lMhfG30M6aIv3s37QcePUZLVCJ1tC2xJnlFY3THEz18K9C0nRqgHmZIbalWhgZq8",
            excerpt: "Using football to bridge divides and foster dialogue in post-conflict zones, creating safe spaces for difficult conversations.",
            badge: "Social Cohesion"
        },
        {
            title: "Empowering Mothers, Building Futures",
            date: "Jul 05, 2023",
            category: "Economic Empowerment",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIrPW8UwNG6UEoJMx1fcg9l7Z-hDd-OUJ-JEnz06yMq7OMkhmjrlkgFclPZUhFBQSVjOHmxcJzh_WWdaXtThCu5Uu4og9OF2QcUqDZcrAsoptb4NPZzT3B4di-cD2PpQoj_oq3w4x8mbqVmDN6Orro28UoxhB7_cluyplx6cDykKvwP39cJHgOqBy8_1GZ6ASmbPM6WBch0Tlfw4E4X3Mq_tPj-uE25irK5v7VwX7pt1gBbBPtvX48O7XZFt8fpNa_nqSG0sj3zjA",
            excerpt: "Micro-loans and sports training combined to create sustainable family incomes, breaking the cycle of poverty for 50 families.",
            badge: "Sustainable Income",
            badgeColor: "bg-primary text-white"
        }
    ];

    const filteredStories = filter === 'All Stories' ? stories : stories.filter(s => s.category === filter);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main">
            {/* Hero Section */}
            <div className="relative flex w-full flex-col overflow-hidden bg-background-dark py-12 md:py-20 lg:py-24">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
                    <div
                        className="h-full w-full bg-cover bg-center bg-no-repeat opacity-60"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPX_k97n5YLxvTAC-0Z4qTRp4R2dTechEqA2gnI9iNHZjKSfhcIUHNtmzKwe9pca-hR70r4uLW0IHEWS_AKjyyz7BCRbruHzp9SoO76aVkmvnPjDoPyhyqxWVj0tpuagcWOGUV9Hlg3HOEboTHTd6SOQFl9Ruzki_v5iEuAWh58-fuJswrroEd6LNYHRsQutDx71UwRpkml92RX_79iovYG6e-zIIlOJs0YueUmSAs5p4Y-_mZCd87-D5Vt69-LbHXlYeF0Zu6bDs")' }}
                    ></div>
                </div>
                <div className="layout-container relative z-20 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                    <div className="flex max-w-3xl flex-col gap-6">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-sm border border-blue-400/20">
                            <span className="material-symbols-outlined text-sm">public</span>
                            Global Impact
                        </span>
                        <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Stories of Resilience <br /><span className="text-blue-400">& Transformation</span>
                        </h1>
                        <p className="max-w-xl text-lg font-light leading-relaxed text-gray-200 sm:text-xl">
                            Witness the real-world impact of sports and empowerment in Rwanda. From local pitches to boardrooms, see how we are building a legacy of leadership.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40">
                                <span>View Impact Reports</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                            <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                                Watch Video
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-16 z-40 w-full border-b border-[#e7ebf3] bg-background-light/95 backdrop-blur-sm dark:border-gray-800 dark:bg-background-dark/95">
                <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-max gap-3">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`group flex h-9 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-[#0d121b] text-white hover:bg-primary'
                                        : 'bg-[#f8f9fc] border border-gray-200 text-[#4c669a] hover:border-primary/50 hover:bg-white hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-primary'
                                    }`}
                            >
                                {filter !== 'All Stories' && f !== filter && <span className="material-symbols-outlined text-[18px]">
                                    {f === 'Peace Makers' ? 'handshake' : f === 'Economic Empowerment' ? 'payments' : f === 'WPS' ? 'security' : 'groups'}
                                </span>}
                                <span>{f}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredStories.map((story, idx) => (
                        <>
                            {idx === 3 && (
                                <div key="cta" className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-primary px-6 py-12 text-center text-white shadow-lg sm:col-span-2 lg:col-span-3">
                                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></div>
                                    <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                                    <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl"></div>
                                    <div className="relative z-10 mx-auto max-w-2xl">
                                        <h3 className="mb-4 font-display text-3xl font-black tracking-tight">Turn empathy into action</h3>
                                        <p className="mb-8 text-lg font-light text-blue-100">
                                            Your donation fuels the next success story. Join us in creating more leaders like Odette and transforming communities across Rwanda.
                                        </p>
                                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                            <div className="flex w-full max-w-xs items-center rounded-lg bg-white p-1 sm:w-auto">
                                                <span className="pl-3 font-bold text-gray-500">$</span>
                                                <input className="w-full border-none bg-transparent p-2 text-lg font-bold text-gray-900 focus:ring-0 placeholder:text-gray-300" placeholder="50" type="number" />
                                            </div>
                                            <button className="h-12 w-full rounded-lg bg-[#0d121b] px-8 font-bold text-white shadow-xl transition-transform hover:scale-105 sm:w-auto">
                                                Donate Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <article key={idx} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:border-gray-800 dark:bg-gray-900">
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${story.image}")` }}
                                    ></div>
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${story.badgeColor || 'bg-white/90 text-primary'}`}>
                                            {story.badgeColor && <span className="material-symbols-outlined mr-1 text-sm">{story.badge.includes('Income') ? 'trending_up' : 'savings'}</span>}
                                            {story.badge}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        <span>{story.date}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{story.category}</span>
                                    </div>
                                    <h3 className="mb-3 font-display text-xl font-bold leading-tight text-text-main group-hover:text-primary transition-colors">
                                        {story.title}
                                    </h3>
                                    <p className="mb-6 flex-1 text-base leading-relaxed text-text-secondary">
                                        {story.excerpt}
                                    </p>
                                    <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3">
                                        Read the Full Impact
                                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </a>
                                </div>
                            </article>
                        </>
                    ))}
                </div>
                <div className="mt-16 flex justify-center">
                    <button className="flex h-12 w-full max-w-[200px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white font-bold text-text-main shadow-sm transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
                        Load More Stories
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
            </main>
        </div>
    );
};
