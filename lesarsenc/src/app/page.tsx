import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Fingerprint, Palette, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-manrope">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary opacity-5 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center">
            <div className="w-full lg:w-1/2 text-center lg:text-left mt-12 lg:mt-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
                We Craft <br />
                <span className="text-primary">Digital Experiences</span> <br />
                That Matter.
              </h1>
              <p className="mt-4 max-w-lg mx-auto lg:mx-0 text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light font-sans mb-8">
                Les Arsene Creatives is a premium design agency transforming brands through bold strategy and meticulous aesthetic execution.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/services"
                  className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-background-dark bg-primary hover:bg-yellow-400 md:text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex justify-center items-center px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary md:text-lg transition-colors"
                >
                  View Work
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-100 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl"></div>
                <img
                  alt="Abstract geometric A logo in yellow"
                  className="w-48 h-48 object-contain z-10 drop-shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRIxEwTAQnKnhU-9NotmQkJJRXG67zPPt_HRfp7JxKb8hSMXCoSP-ci4iqeTtL2_BaMXqyFalN5MTWGBnxYZXZcY0L5gQgRafx6jhlHYEVQCl6F7vZBJcakUaJGxEJHRoLBs06vQQGi4wuCt4-yxBi2DwgyOxDxmJcK4IMyZztEgvVzBSXzKifPaqcsbuIf2njyqDkn6kOBTTLQaAAbLGoJ4843qEPCjY7vipUlYnYLzYHtisOm7l8KakOPmXYIUNnYwotmhymKUua"
                />
              </div>
              <div className="absolute -z-10 top-10 right-10 w-full h-full border-2 border-primary rounded-3xl transform translate-x-4 translate-y-4 opacity-30"></div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 dark:bg-black relative" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-primary font-heading font-bold tracking-wide uppercase text-sm mb-2">
                Our Expertise
              </h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Design Solutions for Modern Brands
              </h3>
              <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<Fingerprint className="text-primary group-hover:text-background-dark h-8 w-8" />}
                title="Brand Identity"
                description="We build memorable brand systems that resonate with your audience. From logo design to comprehensive style guides, we define who you are."
              />
              <ServiceCard
                icon={<Palette className="text-primary group-hover:text-background-dark h-8 w-8" />}
                title="Graphic Design"
                description="Visual storytelling that captures attention. Marketing materials, packaging, and print assets designed with precision and creative flair."
              />
              <ServiceCard
                icon={<Rocket className="text-primary group-hover:text-background-dark h-8 w-8" />}
                title="Digital Strategy"
                description="Data-driven campaigns and social media content that drive growth. We position your brand exactly where your customers are looking."
              />
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20 bg-background-light dark:bg-background-dark" id="portfolio">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Selected Works
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                  A curated selection of our recent projects showcasing our passion for detail and design excellence.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="hidden md:inline-flex items-center text-primary font-bold hover:text-yellow-400 transition-colors mt-4 md:mt-0"
              >
                View Full Portfolio <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PortfolioCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCCkzjPWQBonERsnJk9qyLU3nKlLo8GVLFUQbgoTAqgt3m7dBf8PuyCRL9fusWSChYd_IYSX6x9_4s8aVvyq6SZQJDxYN5cxsgtmT25DBs960AI38vUCSjLm0yyuEyd0ZRxn00cQTKT-KMlQZgv5yxzzGizCEZnVOsrPy4pm9HQ-fYVbHzdQ8ObUQH--QRGpr7B84Kft1krZPTeazrghZz_rABcEKs1yLfoy0ECUJyPX2lBomNl5OC2In_L2btKrMWsmW3_j8lwonhU"
                title="FinTech Dashboard"
                category="UI/UX Design"
              />
              <PortfolioCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDPsTuT3Rc7U2z0-4E_Q8HIQzE3jacT0bWEskJ_G2_FnVosvf9Il1TTxaXcOGerVI9uALl2LAwbH5ohpFbshQinHGgy4yHmwr_KYaMCvKWtq0DOT9-8ATrb6NicqvR4jfZYMvD7gkjHThLLVhMhgoLPaseqbynLgGzd_7BV8hztN0TxElza0nkLov0_FJoOu_ymCyLG7vjtVusDtqj-mmSZjuiRntqMZ9ANUQx-oha7twcpsfgaoHnrxhmZEHR5NeP92XG1z5KCd-Fg"
                title="Nexus Brand Identity"
                category="Branding & Print"
              />
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/portfolio"
                className="inline-flex items-center text-primary font-bold hover:text-yellow-400 transition-colors"
              >
                View Full Portfolio <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-dark dark:bg-black"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to elevate your brand?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto font-light">
              Let's collaborate to build something extraordinary. Our team is ready to bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-background-dark font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-primary/30 hover:bg-white hover:text-background-dark transition-all transform hover:-translate-y-1"
            >
              Start a Project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-8 bg-surface-light dark:bg-surface-dark rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
        {icon}
      </div>
      <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 font-sans text-sm leading-relaxed">
        {description}
      </p>
      <Link href="/services" className="inline-block mt-6 text-sm font-bold text-primary hover:underline">
        Learn more
      </Link>
    </div>
  );
}

function PortfolioCard({ image, title, category }: { image: string; title: string; category: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl aspect-video cursor-pointer">
      <img
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-primary text-sm font-medium">{category}</p>
      </div>
    </div>
  );
}
