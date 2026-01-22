import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl, getAssetUrl } from '../utils/assets';

export const SuccessStories = () => {
    const [filter, setFilter] = useState('All Stories');

    const filters = ['All Stories', 'Peace Makers', 'Economic Empowerment', 'WPS', 'Leadership'];

    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(getApiUrl('stories.php'));
                const data = await response.json();

                // If data is empty (first time run), fallback to some mock or empty
                if (Array.isArray(data) && data.length > 0) {
                    setStories(data);
                } else {
                    // Keep hardcoded as fallback for now if DB is empty, or just blank
                    // For dynamic request, let's prefer data or empty
                }
            } catch (error) {
                console.error("Failed to fetch stories", error);
            }
        };
        fetchStories();
    }, []);

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
                            <Link to="/resources" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/40">
                                <span>View Impact Reports</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
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
                                            <Link to="/donate" className="h-12 w-full rounded-lg bg-[#0d121b] px-8 font-bold text-white shadow-xl transition-transform hover:scale-105 sm:w-auto flex items-center justify-center">
                                                Donate Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <article key={idx} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:border-gray-800 dark:bg-gray-900">
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${getAssetUrl(story.image || story.image_url)}")` }}
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
