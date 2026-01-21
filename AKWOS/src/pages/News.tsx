import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initialNews, NewsItem } from '../data/news';
import { getApiUrl, getAssetUrl } from '../utils/apiConfig';

export const News = () => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(getApiUrl('news.php'));
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Transform API data to match frontend NewsItem interface if needed
                    // The PHP returns: id, title, date, category, image_url, tag, description
                    // Frontend expects: id, title, date, category, image, tag, desc
                    const formattedNews = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        date: item.date,
                        category: item.category,
                        image: item.image_url,
                        tag: item.tag,
                        desc: item.description,
                        featured: item.is_featured == 1
                    }));
                    setNewsItems(formattedNews);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
                // Fallback to static data if API fails (e.g. offline)
                setNewsItems(initialNews);
            }
        };

        fetchNews();
    }, []);

    const filteredNews = newsItems.filter(item => {
        if (filter === "All") return true;
        if (filter === "Press Releases" && item.category === "Press Release") return true;
        // Simple mapping for 'Coverage' to non-press release items for now
        if (filter === "Coverage" && item.category !== "Press Release") return true;
        return false;
    });

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display">

            {/* Hero Section (Featured Story) */}
            <section className="relative w-full overflow-hidden bg-white dark:bg-[#151c2a] py-12 lg:py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-10">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                        <div className="flex flex-1 flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 dark:border-blue-900/30 dark:bg-blue-900/20">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Global Spotlight</span>
                            </div>
                            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-[#0d121b] dark:text-white lg:text-5xl xl:text-6xl">
                                Empowering Women Through Sport: AKWOS at the UN Summit
                            </h1>
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                                Founder Felicite Rwemarika discusses the future of sports development in East Africa at the Global Goals gathering, emphasizing sustainable growth and gender equity.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                    <span>Read Full Article</span>
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </button>
                                <button className="flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2332] dark:text-white dark:hover:bg-slate-800 transition-all">
                                    <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                    <span>Watch Keynote</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative flex-1">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
                                <div
                                    className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                    style={{ backgroundImage: 'url("/images/news/felicite-award.jpg")' }}
                                ></div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                                    <p className="text-xs font-medium opacity-90">Photo: UN General Assembly / 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar (Media Mentions) */}
            <section className="border-y border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-black/20">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-8 lg:flex-row lg:justify-between lg:px-10 lg:py-10">
                    <h3 className="whitespace-nowrap text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Media Mentions
                    </h3>
                    <div className="flex w-full flex-wrap justify-center gap-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 lg:justify-end lg:gap-12 items-center">
                        {/* Logos simulated with text for strict placeholder adherence, but structured as images for design intent */}
                        <span className="text-xl font-bold font-serif dark:text-white">BBC Sport</span>
                        <span className="text-xl font-bold font-serif dark:text-white">Al Jazeera</span>
                        <span className="text-xl font-bold font-serif dark:text-white">The Guardian</span>
                        <div className="flex items-center gap-2 font-serif text-xl font-bold italic leading-none text-black dark:text-white">The New Times</div>
                    </div>
                </div>
            </section>

            {/* Main Layout: Grid + Sidebar */}
            <section className="bg-background-light dark:bg-background-dark py-12 lg:py-16">
                <div className="mx-auto max-w-7xl px-5 lg:px-10">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">

                        {/* Left Column: News Feed */}
                        <div className="flex flex-col gap-8 lg:col-span-8">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">Latest News</h2>
                                <div className="flex gap-2">
                                    {['All', 'Press Releases', 'Coverage'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* News Grid */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {filteredNews.map((news, idx) => (
                                    <article key={idx} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-[#1a2332] dark:shadow-none dark:border dark:border-slate-800">
                                        <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                                            <div
                                                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url('${getAssetUrl(news.image)}')` }}
                                            ></div>
                                            <div className="absolute left-4 top-4 rounded bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-black backdrop-blur-sm">
                                                {news.tag}
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                <span>{news.date}</span>
                                                <span className="px-1">•</span>
                                                <span className="uppercase text-primary">{news.category}</span>
                                            </div>
                                            <h3 className="mb-3 text-lg font-bold leading-tight text-[#0d121b] group-hover:text-primary dark:text-white">
                                                {news.title}
                                            </h3>
                                            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                {news.desc}
                                            </p>
                                            <a className="mt-auto flex items-center gap-1 text-sm font-bold text-primary hover:underline" href="#">
                                                Read More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex justify-center gap-2">
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2332] dark:text-slate-400 transition-colors">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">1</button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2332] dark:text-slate-400 transition-colors">2</button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2332] dark:text-slate-400 transition-colors">3</button>
                                <span className="flex h-10 w-10 items-center justify-center text-slate-400">...</span>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2332] dark:text-slate-400 transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Sidebar */}
                        <aside className="flex flex-col gap-8 lg:col-span-4">
                            {/* Press Kit Widget */}
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1a2332]">
                                <h4 className="mb-4 text-lg font-bold text-[#0d121b] dark:text-white">Press Resources</h4>
                                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Access our official assets for media coverage and partnership announcements.</p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { title: "Full Press Kit", size: "ZIP • 25 MB", icon: "folder_zip" },
                                        { title: "Leadership Bios", size: "PDF • 1.2 MB", icon: "description" },
                                        { title: "Official Logos", size: "AI / PNG • 5 MB", icon: "image" }
                                    ].map((item, idx) => (
                                        <a key={idx} className="group flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors" href="#">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-primary shadow-sm dark:bg-slate-700 dark:text-white">
                                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary dark:text-slate-200 transition-colors">{item.title}</span>
                                                    <span className="text-[10px] text-slate-400">{item.size}</span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Media Contact Widget */}
                            <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg">
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div>
                                        <h4 className="text-lg font-bold">Media Inquiries</h4>
                                        <p className="mt-2 text-sm text-blue-100">For interviews, high-res imagery, or additional comments, please contact our comms team.</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                            <span className="text-sm font-medium">press@akwos.org</span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2">
                                            <span className="material-symbols-outlined text-[20px]">call</span>
                                            <span className="text-sm font-medium">+250 788 123 456</span>
                                        </div>
                                    </div>
                                    <Link to="/contact" className="mt-2 w-full flex items-center justify-center rounded-lg bg-white py-3 text-sm font-bold text-primary hover:bg-blue-50 transition-colors">
                                        Send Message
                                    </Link>
                                </div>
                                {/* Decorative background circle */}
                                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                            </div>

                            {/* Newsletter Signup (Bonus) */}
                            <div className="rounded-xl bg-transparent p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                                <span className="material-symbols-outlined text-[32px] text-slate-400 mb-2">mark_email_unread</span>
                                <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Stay Updated</h4>
                                <p className="mb-3 text-xs text-slate-500">Get the latest updates directly in your inbox.</p>
                                <div className="flex gap-2">
                                    <input className="w-full rounded border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Email address" type="email" />
                                    <button className="bg-slate-800 text-white rounded px-3 hover:bg-black transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};
