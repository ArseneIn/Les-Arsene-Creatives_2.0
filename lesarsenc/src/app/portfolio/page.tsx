import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Portfolio() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />
            <main className="flex-grow">
                {/* Header */}
                <header className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32">
                    <h2 className="text-primary font-display font-bold text-sm tracking-widest uppercase mb-4">
                        Our Creative Portfolio
                    </h2>
                    <h1 className="font-display font-extrabold text-4xl md:text-6xl mb-6 text-gray-900 dark:text-white leading-tight">
                        Crafting Digital <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
                            Masterpieces
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
                        We blend strategy, design, and technology to build brands that stand
                        out in the digital landscape. Explore our selected works.
                    </p>
                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <FilterButton active>All Work</FilterButton>
                        <FilterButton>Branding</FilterButton>
                        <FilterButton>Web Design</FilterButton>
                        <FilterButton>Marketing</FilterButton>
                        <FilterButton>Motion</FilterButton>
                    </div>
                </header>

                {/* Projects Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCxpfURf390YKe6hHwTER3V95elQhy9ctOBHE1onFnfhCh_9l74Qd9h7m8CE5a2aTesDAhnnyedFJwsqhM2W5-nxFT9tzZVwIgDpd4PGZcpDZRjCtXV25UPS37QedIPI84r7Uuz1mIKukySOMtY7Jq7sh8oizn5WPZTIy6OUSVk3abNnYS8j1WsFjrjoMsr45daB230jfkLeH5ssKosxKylxj7LewbGvEzIJIPEL7_IYaJAj-QSosORNuf3qCKwsljwyECoRFTFrT30"
                            category="Branding Identity"
                            title="NeoTech Evolution"
                            description="A complete rebrand for the future of technology, focusing on bold colors and geometric precision."
                            aspect="aspect-[3/4] md:aspect-auto md:h-[500px]"
                        />
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDinuQCr9NttYIv3W87YeWU-ImfbDSUY8aXqeWoXvUei6uH8doHdcR1qtIBXP_mtrROFDGcFOY9IMNgB882rMwpgTmy5wgYaAZyfdastOzc4jGEBdKwVSVrudiOa0LZroshyasWOqWZvyWWHNMaAwM_nNLOoGJ4eA3MOxskQHy05iVB_VsGl9l6VC6r2MxwhMv6lWj_VAEu3cNM1M37fc8DGsDG1Hte_kd7J8aTBh6FzUvd6ggGDkkk8BCSYChmk0i-liuUkOfFVk14"
                            category="UI/UX Design"
                            title="FinFlow App"
                            aspect="aspect-square"
                        />
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDNRIyHVDj5Z2YBpsLiD-vYr51FqLp3QxC8oldPtpnDoQYgZDZUcG92t90bwXIykzEEu_Q0d0Ozbg4sTR8jpwd2H7Mfh_GB38kaxNwbymImpnmbI5Q-vxUoKB4PXVbrxXTqPMU11XwFLbJpslUtzrkjYP2Oc-mdYm8YxmDu5dLBApGb6_i_iXrDrQEer4zhFa-MbKyA29Sa1iARErNjyi_noO4-wUHO5DC7bdBkjWRdpfZEZUOI7m856jBlWVVlRBjelwuZg-4nXMe8"
                            category="Packaging"
                            title="Lura Cosmetics"
                            aspect="aspect-square"
                        />
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBWqUgKuMSZmnJwiMuVJwBZyGWH1fieygo08OCcLP8ptMIRZcXkMOm1Q7_wRWttP-f1z0BGG0e_qoNHtf1KT_HEd648PD5T-J6MggvvULKfG3pioCmD9_PzolTl6ZsK_lbTlOUtCAPxqi0xwr9kFEwiM6e4m1I7L6GUqtAwTd-5ZH9nyCJfGBnawCoWlcuaOKS9eY5TsYZKwADWNzDY7csweqqW9-iGVvlM2dthxuCvSdiVHFNMIzbPRY3ZQZ8s6QpQXUq7K6ZmHqOl"
                            category="Web Development"
                            title="Apex Dashboard"
                            aspect="aspect-square"
                        />
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBQWK3Q7_fc7YB9Mzt2tJBLpUNvOuggA9ghImK183hijXlAkakLg73pDoK3tK0rnwPvzkYvX5abD7Kfky3xmoJ-vBM3StvGQWtNF5Gdk15kGKBjnF0sUqIEx46kUorNzwocURVUsdt_ggCfmNvB1y5fZ1NlXM1OvCOTiVvnATHXsUrMSD6p1McogjAH3suhG2XtLanJq3cBfCDyujb4UlHRqIYJSgz7GphJDd-HZn3s-XSvtpI34c0ko3H-QwuBWk2DToS5Jedq_LDe"
                            category="Motion & 3D"
                            title="CyberCore Advertising"
                            description="An immersive 3D advertising campaign that blurs the lines between reality and the digital world."
                            aspect="aspect-[3/4] md:aspect-auto md:col-span-2 md:h-[500px]"
                        />
                        <ProjectCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCGTLuWTVrfcLauQpGUyWmYou8fUiOOl51TOgw7pgUiUhXq2ZTGUKKgr23EAPIn3KE-7hAihYR-hLcFvsVYZLJMX2S8r-jBmSZOWHvGfQKXBNw_kCA0daF12cyuipGtfL7gNf7kQ8SW9GZsrG_mDoyIcKhbhu5ZPYVrQABZMe6TTbtRYEHgGLGCXjSOa9pgfKgF6NXqC_URTfJhHh9faaUIslEdUlibUVXuubIsQTZUzPtjDz-ou7iaqIE31UEy_G91AI0b_MLx3wAi"
                            category="Print Media"
                            title="Vogue Refresh"
                            aspect="aspect-square"
                        />
                    </div>
                    <div className="mt-20 text-center">
                        <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-transparent border-2 border-gray-900 dark:border-white rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-background-dark text-gray-900 dark:text-white">
                            <span className="mr-2">Load More Projects</span>
                            <ChevronDown className="group-hover:translate-y-1 transition-transform h-5 w-5" />
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function FilterButton({
    children,
    active = false,
}: {
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <button
            className={`px-6 py-2 rounded-full border transition-all ${active
                    ? "border-primary bg-primary text-background-dark font-semibold shadow-lg shadow-primary/25"
                    : "border-gray-300 dark:border-gray-700 hover:border-primary text-gray-600 dark:text-gray-300 hover:text-primary bg-transparent"
                }`}
        >
            {children}
        </button>
    );
}

function ProjectCard({
    image,
    category,
    title,
    description,
    aspect,
}: {
    image: string;
    category: string;
    title: string;
    description?: string;
    aspect: string;
}) {
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-surface-dark ${aspect}`}
        >
            <div className="w-full h-full overflow-hidden">
                <img
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={image}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2">
                    {category}
                </span>
                <h3 className="text-white font-display font-bold text-2xl md:text-3xl mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                        {description}
                    </p>
                )}
                <div className="mt-2 flex items-center text-white font-medium gap-2">
                    View Project <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}
