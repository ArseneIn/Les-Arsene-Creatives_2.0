import React from 'react';
import { ArrowLeft, Printer, AlertTriangle, Scale, Ban, ShieldAlert } from 'lucide-react';
import NovaLogo from '../components/ui/NovaLogo';

import { useNavigate } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    { id: 'agreement', title: '1. User Agreement' },
    { id: 'pricing', title: '2. Pricing & Errors' },
    { id: 'conduct', title: '3. Prohibited Conduct' },
    { id: 'warranty', title: '4. Warranty Policy' },
    { id: 'governing-law', title: '5. Governing Law' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-[#333333] font-sans selection:bg-[#FF6B00] selection:text-white">
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 print:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#FF6B00] font-bold text-sm hover:translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Terminal
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Node Version: 5.0 // Nov 2024
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
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

        <article className="max-w-3xl flex-1 print:max-w-full">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-6">
              Nova Trend | <span className="text-[#FF6B00]">Service Terms</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              By accessing the Nova Trend platform, you enter into a binding diagnostic handshake with the Trend Registry. These terms govern all hardware deployments.
            </p>
          </header>

          <section id="agreement" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">1. User Agreement</h2>
            <p>Nova Trend constitutes a legal framework for elite hardware procurement. You represent that your professional identity is verified and authorized for high-value asset acquisition.</p>
          </section>

          <section id="pricing" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">2. Pricing & Errors</h2>
            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex gap-6 items-start">
              <AlertTriangle className="w-12 h-12 text-[#FF6B00] shrink-0" />
              <div>
                <p className="font-bold text-black mb-2 uppercase text-sm">Discrepancy Protocol</p>
                <p className="text-sm leading-relaxed text-orange-900">
                  Nova Trend reserves the right to void any node allocation for products listed at incorrect pricing due to registry errors. Any payments rendered for voided orders will be fully refunded to your registered **Mobile Money (MoMo)** account within 48 hours.
                </p>
              </div>
            </div>
          </section>

          <section id="conduct" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">3. Prohibited Conduct</h2>
            <p>The Registry prohibits automated scraping, registry manipulation, and the use of identity bots. Any discovery of such activity results in a permanent Node Terminate event.</p>
          </section>

          <section id="governing-law" className="space-y-6 mb-16">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">4. Governing Law</h2>
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex gap-6 items-start">
              <Scale className="w-12 h-12 text-black shrink-0" />
              <div>
                <p className="font-bold text-black mb-2 uppercase text-sm">Republic of Rwanda Jurisdiction</p>
                <p className="text-sm leading-relaxed">
                  These terms are strictly governed by the digital and commerce laws of the Republic of Rwanda. Disputes shall be resolved exclusively within the competent courts of Kigali.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-zinc-100 pt-12 flex justify-between items-center print:hidden">
            <button onClick={() => window.print()} className="flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] font-bold uppercase text-[10px] tracking-widest transition-colors"><Printer className="w-4 h-4" /> Print Document</button>
            <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all hover:bg-[#FF6B00]">Accept Registry Terms</button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TermsOfUse;