"use client";

import { useState, useEffect, useRef } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticText from "@/components/KineticText";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Globe, Zap, Layout } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getImagePath } from "@/utils/imagePath";

import ImigongoPattern from "@/components/ImigongoPattern";

export default function Home() {
  const container = useRef(null);

  return (
    <div ref={container} className="min-h-screen flex flex-col font-space">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Formula Section */}
        <Formula />

        {/* Services Section */}
        <Services />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Portfolio Section */}
        <Portfolio />


      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  const [heroTitle, setHeroTitle] = useState("DIGITAL");
  const [heroSubtitle, setHeroSubtitle] = useState("ALCHEMY");

  useEffect(() => {
    // Fetch content from CMS API
    fetch('/api/content.php')
      .then(res => res.json())
      .then(data => {
        if (data.hero_title) {
          // Split title for formatting if needed, or just use as is. 
          // Current design splits 'DIGITAL' and 'ALCHEMY'. 
          // For simplicity, let's assume the CMS sends the full title and we might adjust formatting later
          // Or we can just use the CMS data directly. 
          // Let's assume the user edits "DIGITAL ALCHEMY" as one string in the CMS 
          // but the design requires a break. We'll handle a simple split if it contains a space.
          const parts = data.hero_title.split(' ');
          if (parts.length > 1) {
            setHeroTitle(parts[0]);
            setHeroSubtitle(parts.slice(1).join(' '));
          } else {
            setHeroTitle(data.hero_title);
            setHeroSubtitle("");
          }
        }
        // Actually, the previous design had Title + Subtitle (Paragraph).
        // Let's look at the original code: 
        // <h1> DIGITAL <br/> ALCHEMY </h1> 
        // <p> We engineer growth... </p> (This is what I called 'hero_subtitle' in the admin?? No wait)

        // In Admin I had:
        // Main Heading (hero_title) -> "Digital Alchemy"
        // Subheading (hero_subtitle) -> "Where Strategy Meets Serendipity" (This matches nothing in the current design)
        // The current p tag says: "We engineer growth for SMEs..."

        // Let's map it:
        // hero_title -> The H1 (Digital Alchemy)
        // hero_subtitle -> The Paragraph text ("We engineer growth...")

        if (data.hero_title) {
          const parts = data.hero_title.split(' ');
          if (parts.length >= 2) {
            setHeroTitle(parts[0]);
            setHeroSubtitle(parts.slice(1).join(' '));
          } else {
            setHeroTitle(data.hero_title);
            setHeroSubtitle("");
          }
        }

        // Wait, I need a state for the paragraph too.
        // I'll create a new state for the paragraph text.
      });
  }, []);

  // Re-reading my Admin code: 
  // Main Heading: hero_title
  // Subheading: hero_subtitle (TextArea)

  // So I should map 'hero_subtitle' to the paragraph <p>.

  const [paragraphText, setParagraphText] = useState("We engineer growth for SMEs through custom SaaS and precision marketing. Enterprise-grade power, tailored for you.");

  useEffect(() => {
    fetch('/api/content.php')
      .then(res => res.json())
      .then(data => {
        if (data.hero_title) {
          // Logic to split title for the visual effect
          // If user saves "SUPER AGENCY", it becomes "SUPER" (white) "AGENCY" (black/kinetic)
          const parts = data.hero_title.split(' ');
          if (parts.length >= 2) {
            setHeroTitle(parts[0]);
            setHeroSubtitle(parts.slice(1).join(' '));
          } else {
            setHeroTitle(data.hero_title);
            setHeroSubtitle(""); // Or handle single word titles differently
          }
        }
        if (data.hero_subtitle) {
          setParagraphText(data.hero_subtitle);
        }
      })
      .catch(err => console.error("CMS Load Error", err));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 bg-gradient-to-b from-primary to-black pt-32 md:pt-40">
      {/* Techy Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        {/* Imigongo Overlay */}
        <ImigongoPattern opacity={0.05} className="mix-blend-overlay" />
      </div>
      <div className="max-w-7xl w-full mx-auto z-10 relative">
        <motion.div className="flex flex-col items-center text-center">
          <div className="mb-6 px-4 py-1 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm">
            <span className="text-black text-xs font-bold tracking-[0.2em] uppercase">Digital Experience Agency</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-syne font-black tracking-tighter text-black leading-[0.8] mb-8">
            <KineticText>{heroTitle}</KineticText> <br />
            <span className="text-white">
              <KineticText>{heroSubtitle}</KineticText>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary font-medium max-w-2xl leading-relaxed mb-12">
            {paragraphText}
          </p>
          <Magnetic>
            <Link
              href="/portfolio"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white font-bold uppercase tracking-wider overflow-hidden hover:bg-white hover:text-black transition-all duration-300 border border-primary/50 shadow-[0_0_30px_rgba(233,180,7,0.4)] hover:shadow-[0_0_50px_rgba(233,180,7,0.6)]"
            >
              <span className="relative z-10">Explore Work</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* Parallax Background Element */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0j_Z5Y683416409249715904_hero_bg_1768435715904"
          alt="Abstract Digital Art"
          fill
          className="object-cover opacity-40 mix-blend-soft-light"
          priority
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs font-mono text-black/60 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black to-transparent"></div>
      </motion.div>
    </section>
  );
}

function Formula() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">The Formula</span>
          <h2 className="text-4xl md:text-6xl font-syne font-bold">
            Digital <span className="text-primary">Alchemy</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* The Engine */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500 group">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-syne font-bold mb-4">The Engine</h3>
            <p className="text-gray-400 font-space leading-relaxed mb-6">
              We build the custom SaaS platforms and automation systems that power your operations.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Custom SaaS
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Workflow Automation
              </li>
            </ul>
          </div>

          {/* The Catalyst */}
          <div className="text-center md:py-12">
            <div className="text-6xl font-syne font-black text-white/10 mb-2">+</div>
            <p className="text-xl font-syne font-bold text-white mb-2">Combined</p>
            <p className="text-sm text-gray-400 uppercase tracking-widest">To Create</p>
            <div className="mt-8 inline-block px-6 py-2 rounded-full bg-primary text-black font-bold uppercase tracking-wider">
              Value
            </div>
          </div>

          {/* The Fuel */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500 group">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-syne font-bold mb-4">The Fuel</h3>
            <p className="text-gray-400 font-space leading-relaxed mb-6">
              We deploy precision marketing campaigns to drive traffic and convert leads.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> SEO & Paid Ads
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Growth Strategy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const INITIAL_SERVICES = [
  { icon: "Globe", title: "SaaS & Automation", desc: "Custom platforms that streamline your business." },
  { icon: "Zap", title: "Growth Marketing", desc: "SEO & Ads that drive measurable ROI." },
  { icon: "Layout", title: "Experience Design", desc: "Intuitive UI/UX for web and mobile." },
  { icon: "ArrowUpRight", title: "Brand Strategy", desc: "Positioning your business for success." }
];

function Services() {
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);

  useEffect(() => {
    fetch('/api/content.php')
      .then(res => res.json())
      .then(data => {
        if (data.services) {
          try {
            const parsed = typeof data.services === 'string' ? JSON.parse(data.services) : data.services;
            setServices(parsed);
          } catch (e) { console.error("Services Parse Error", e); }
        }
      })
      .catch(err => console.error("CMS Load Error (Services)", err));
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case "Globe": return <Globe className="w-8 h-8" />;
      case "Zap": return <Zap className="w-8 h-8" />;
      case "Layout": return <Layout className="w-8 h-8" />;
      case "ArrowUpRight": return <ArrowUpRight className="w-8 h-8" />;
      default: return <Globe className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Expertise</span>
            <h2 className="text-5xl md:text-7xl font-syne font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              We build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-500">
                Digital Empires.
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
              We don&apos;t just design websites; we craft digital ecosystems. From brand identity to complex web applications, we provide end-to-end solutions for ambitious brands.
            </p>
            <Magnetic>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                View All Services
              </Link>
            </Magnetic>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={getIcon(service.icon || "Globe")}
                title={service.title}
                desc={service.desc}
                className={index % 2 !== 0 ? "md:translate-y-12" : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, desc, className }: { icon: React.ReactNode, title: string, desc: string, className?: string }) {
  return (
    <div className={`p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-all duration-500 group ${className}`}>
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-6 text-gray-900 dark:text-white group-hover:bg-primary group-hover:text-background-dark transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-syne font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}

const INITIAL_PROJECTS = [
  {
    title: "FinTech Dashboard",
    category: "UI/UX Design",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCkzjPWQBonERsnJk9qyLU3nKlLo8GVLFUQbgoTAqgt3m7dBf8PuyCRL9fusWSChYd_IYSX6x9_4s8aVvyq6SZQJDxYN5cxsgtmT25DBs960AI38vUCSjLm0yyuEyd0ZRxn00cQTKT-KMlQZgv5yxzzGizCEZnVOsrPy4pm9HQ-fYVbHzdQ8ObUQH--QRGpr7B84Kft1krZPTeazrghZz_rABcEKs1yLfoy0ECUJyPX2lBomNl5OC2In_L2btKrMWsmW3_j8lwonhU"
  },
  {
    title: "Nexus Brand Identity",
    category: "Branding",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPsTuT3Rc7U2z0-4E_Q8HIQzE3jacT0bWEskJ_G2_FnVosvf9Il1TTxaXcOGerVI9uALl2LAwbH5ohpFbshQinHGgy4yHmwr_KYaMCvKWtq0DOT9-8ATrb6NicqvR4jfZYMvD7gkjHThLLVhMhgoLPaseqbynLgGzd_7BV8hztN0TxElza0nkLov0_FJoOu_ymCyLG7vjtVusDtqj-mmSZjuiRntqMZ9ANUQx-oha7twcpsfgaoHnrxhmZEHR5NeP92XG1z5KCd-Fg"
  }
];

function Portfolio() {
  const [projects, setProjects] = useState<any[]>(INITIAL_PROJECTS);

  useEffect(() => {
    fetch('/api/content.php')
      .then(res => res.json())
      .then(data => {
        if (data.portfolio_items) {
          try {
            const parsed = typeof data.portfolio_items === 'string' ? JSON.parse(data.portfolio_items) : data.portfolio_items;
            setProjects(parsed);
          } catch (e) { console.error("Portfolio Parse Error", e); }
        }
      })
      .catch(err => console.error("CMS Load Error (Portfolio)", err));
  }, []);

  return (
    <section className="py-32 bg-gray-900 dark:bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <h2 className="text-5xl md:text-8xl font-syne font-black uppercase tracking-tighter leading-none">
            Selected <br /> <span className="text-primary">Works</span>
          </h2>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-gray-400 max-w-sm text-right hidden md:block">
              A curation of our finest digital craftsmanship.
            </p>
            <Magnetic>
              <Link href="/portfolio" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm">
                View All Projects
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              category={project.category}
              image={project.image}
              className={index % 2 !== 0 ? "md:translate-y-24" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ title, category, image, className }: { title: string; category: string; image: string; className?: string }) {
  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="relative overflow-hidden aspect-[16/10] mb-8 rounded-2xl">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <Image
          src={getImagePath(image)}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <ArrowUpRight className="w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-syne font-bold text-white mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
              {category}
            </span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
              2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_TESTIMONIALS = [
  {
    quote: "Les Arsene transformed our vague ideas into a digital powerhouse. Our conversion rates doubled within a month.",
    author: "Sarah Jenkins",
    role: "CEO, TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "The level of precision and creativity they bring is unmatched. Truly digital alchemy at work.",
    author: "David Chen",
    role: "Founder, Nexus Stream",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "A long-term partner that understands business growth as well as they understand code.",
    author: "Elena Rodriguez",
    role: "Marketing Director, Aura",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(INITIAL_TESTIMONIALS);

  useEffect(() => {
    fetch('/api/content.php')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials) {
          try {
            const parsed = typeof data.testimonials === 'string' ? JSON.parse(data.testimonials) : data.testimonials;
            setTestimonials(parsed);
          } catch (e) { console.error("Testimonials Parse Error", e); }
        }
      })
      .catch(err => console.error("CMS Load Error (Testimonials)", err));
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent dark:from-white/5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Voices of Partners</span>
          <h2 className="text-4xl md:text-6xl font-syne font-bold text-gray-900 dark:text-white">
            Trusted by <br /> Visionaries.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="flex flex-col justify-between p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-all duration-500 group">
              <div>
                <div className="text-primary mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-white/20">
                  <Image
                    src={getImagePath(item.image)}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.author}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


