import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NovaLogo from '../ui/NovaLogo';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#05070C] border-t border-white/5 pt-20 pb-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 items-start">
          {/* Column 1: Brand & DNA */}
          <div className="md:col-span-4 space-y-8">
            <NovaLogo theme="brand" />
            <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-sm">
              Equipping Africa's most talented creators and engineers with world-class gear. Nova Trend is the high-conversion safety standard for professional technology.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-nova-orange hover:border-nova-orange/50 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Registry & Protocols */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-10 brand-font">Registry</h4>
              <ul className="space-y-6 text-[11px] font-black text-slate-500 tracking-widest">
                <li><button onClick={() => navigate('/best-sellers')} className="hover:text-white transition-colors">Best Sellers</button></li>
                <li><button onClick={() => navigate('/gaming')} className="hover:text-white transition-colors">Gaming</button></li>
                <li><button onClick={() => navigate('/business')} className="hover:text-white transition-colors">Business</button></li>
                <li><button onClick={() => navigate('/comparison-tool')} className="hover:text-white transition-colors">Comparison</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-10 brand-font">Protocols</h4>
              <ul className="space-y-6 text-[11px] font-black text-slate-500 tracking-widest">
                <li><button onClick={() => navigate('/policies/shipping')} className="hover:text-white transition-colors">Shipping</button></li>
                <li><button onClick={() => navigate('/policies/returns')} className="hover:text-white transition-colors">Returns</button></li>
                <li><button onClick={() => navigate('/policies/warranty')} className="hover:text-white transition-colors">Warranty</button></li>
                <li><button onClick={() => navigate('/track')} className="hover:text-white transition-colors">Tracking</button></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact & Logistics Node (Clinical Card) */}
          <div className="md:col-span-4">
            <div className="bg-[#0A0D18] p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-10 group hover:border-nova-orange/20 transition-all">
              <h4 className="text-white font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-3 brand-font">
                <Globe className="w-4 h-4 text-nova-orange" /> KIGALI HUB NODE
              </h4>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <MapPin className="w-5 h-5 text-nova-orange shrink-0 mt-0.5" />
                  <span className="text-[11px] font-black text-slate-300 leading-relaxed uppercase tracking-widest">KN 3 RD, DOWNTOWN<br />KIGALI, RWANDA</span>
                </div>
                <div className="flex items-center gap-5">
                  <Phone className="w-5 h-5 text-nova-orange shrink-0" />
                  <span className="text-[11px] font-black text-slate-300 mono tracking-widest">+250 787 202 583</span>
                </div>
                <div className="flex items-center gap-5">
                  <Mail className="w-5 h-5 text-nova-orange shrink-0" />
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">OPS@NOVATREND.RW</span>
                </div>
              </div>

              {/* Node Mark - Subtle watermark matches screenshot */}
              <div className="pt-4 flex flex-col gap-1.5 opacity-10">
                <div className="flex gap-1.5">
                  <div className="w-8 h-1 bg-white" />
                  <div className="w-8 h-1 bg-white" />
                </div>
                <div className="w-1 h-8 bg-white ml-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
          <p>© 2025 NOVA TREND. UNIFIED TECHNICAL REGISTRY</p>
          <div className="flex gap-10">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
