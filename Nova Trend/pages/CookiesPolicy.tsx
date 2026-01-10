
import React from 'react';
import { ArrowLeft, Printer, Cookie, BarChart, ShoppingCart, Languages, Target } from 'lucide-react';
import NovaLogo from '../components/ui/NovaLogo';

import { useNavigate } from 'react-router-dom';

const CookiesPolicy: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    { id: 'definition', title: '1. What are Cookies?' },
    { id: 'essential', title: '2. Essential Cookies' },
    { id: 'analytics', title: '3. Analytics' },
    { id: 'marketing', title: '4. Personalized Deals' },
    { id: 'control', title: '5. Managing Cookies' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-[#333333] font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Header Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 print:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#FF6B00] font-bold text-sm hover:translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Last Updated: November 12, 2024
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 lg:sticky lg:top-32 h-fit print:hidden">
          <h4 className="text-black font-black uppercase text-xs tracking-widest mb-6 pb-2 border-b border-zinc-100">Sections</h4>
          <nav className="space-y-4">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="block text-left text-sm font-medium hover:text-[#FF6B00] transition-colors"
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="max-w-3xl flex-1 print:max-w-full">
          <div className="hidden print:block mb-10">
            <NovaLogo variant="mark" theme="light" size={60} />
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-6">
              Nova Trend | <span className="text-[#FF6B00]">Cookie Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              We use digital cookies and similar tracking technologies to optimize your shopping experience, remember your preferences, and ensure the Nova Trend site runs at peak performance.
            </p>
          </header>

          <section id="definition" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">1. What are Cookies?</h2>
            <p>Cookies are small text files stored on your browser or device when you visit our platform. They allow us to recognize your session and provide customized functionality.</p>
          </section>

          <section id="essential" className="space-y-8 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">2. Essential Cookies</h2>
            <p>These are mandatory for the core operation of the e-commerce store. Without these, you cannot complete a purchase.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <ShoppingCart className="text-[#FF6B00] w-8 h-8 mb-4" />
                <h4 className="font-bold text-black mb-2">Cart Persistence</h4>
                <p className="text-xs text-zinc-500">Remembers which items you've added to your cart as you browse different sections.</p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <Languages className="text-[#FF6B00] w-8 h-8 mb-4" />
                <h4 className="font-bold text-black mb-2">Language & Region</h4>
                <p className="text-xs text-zinc-500">Remembers your preference for English, French, or Kinyarwanda interfaces.</p>
              </div>
            </div>
          </section>

          <section id="analytics" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">3. Analytics</h2>
            <div className="flex gap-6 items-start">
              <BarChart className="w-10 h-10 text-[#FF6B00] shrink-0" />
              <div>
                <p className="font-bold text-black mb-2 uppercase text-xs tracking-widest">Performance Tracking</p>
                <p className="text-sm leading-relaxed">
                  We use cookies from partners like Google Analytics and Hotjar to understand how users interact with our site. This data is anonymized and used to fix bugs, improve navigation, and speed up load times for Kigali users.
                </p>
              </div>
            </div>
          </section>

          <section id="marketing" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">4. Personalized Deals</h2>
            <div className="flex gap-6 items-start">
              <Target className="w-10 h-10 text-[#FF6B00] shrink-0" />
              <div>
                <p className="font-bold text-black mb-2 uppercase text-xs tracking-widest">Targeted Offers</p>
                <p className="text-sm leading-relaxed">
                  Marketing cookies allow us to show you relevant laptop deals based on your browsing history. If you've been looking at Gaming Laptops, we'll ensure you see the latest Orange Tag sales for that specific category.
                </p>
              </div>
            </div>
          </section>

          <section id="control" className="space-y-6 mb-16">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">5. Managing Cookies</h2>
            <p>You have full control over your digital footprint. You can choose to disable non-essential cookies via our consent banner or your browser settings.</p>
            <div className="p-8 bg-zinc-950 rounded-[40px] text-center border border-zinc-800 shadow-2xl">
              <Cookie className="w-10 h-10 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-lg font-black text-white uppercase italic mb-2">Cookie Preferences</h3>
              <p className="text-zinc-500 text-xs mb-8">Clicking "Accept All" provides the fastest and most personalized experience.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#FF6B00] text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest"
              >
                Reset Preferences
              </button>
            </div>
          </section>

          <div className="border-t border-zinc-100 pt-12 flex justify-between items-center print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] font-bold uppercase text-[10px] tracking-widest transition-colors"
            >
              <Printer className="w-4 h-4" /> Print this Document
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all hover:bg-[#FF6B00]"
            >
              I Understand
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CookiesPolicy;
