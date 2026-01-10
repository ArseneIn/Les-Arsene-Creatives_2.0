
import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, Linkedin, ArrowRight, Award } from 'lucide-react';
import NovaLogo from '../components/ui/NovaLogo';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth(); // If needed for contact info

  const handleContact = () => {
    window.location.href = 'mailto:arsene@novatrend.rw?subject=Enterprise%20Inquiry';
  };
  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Elite Workspace"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <NovaLogo variant="mark" theme="orange" size={60} className="mb-10" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
              KIGALI INNOVATION CORE
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic leading-[0.85] tracking-tighter mb-8">
              Standardizing the <br />
              <span className="text-[#FF6B00]">Digital Frontier.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed italic">
              "Nova Trend isn't just a storefront. It's a verified neural network for elite hardware procurement."
            </p>
          </div>
        </div>
      </section>

      {/* Trust Numbers Row */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black text-black tabular-nums">750+</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Fleet Deployed</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-[#FF6B00] tabular-nums">99%</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Node Reliability</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-black tabular-nums">12Mo.</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Nova-Shield Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Nova Story */}
      <section className="py-32 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="w-12 h-1 bg-[#FF6B00]" />
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic leading-none">
              The Nova <span className="text-[#FF6B00]">DNA</span>
            </h2>
            <div className="space-y-6 text-lg text-zinc-600 font-medium leading-relaxed">
              <p>
                Founded in Kigali, Nova Trend was established to eliminate the volatility of regional hardware sourcing. We identified a critical need for verified, high-performance equipment backed by local technical accountability.
              </p>
              <p>
                Our "Trend Registry" ensures that every asset deployed through our platform is manufacturer-original and specifically configured for the African professional landscape.
              </p>
              <p>
                We bridge the gap between global hardware giants and the Rwandan creator ecosystem, providing the infrastructure for modern success.
              </p>
            </div>

            <div className="pt-8 flex items-center gap-6">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center font-black text-2xl text-white italic shadow-xl">N</div>
              <div>
                <p className="text-xl font-black text-black uppercase italic">Arsene Cyuzuzo</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">Nova Chief of Operations</p>
                  <a href="#" className="p-1.5 bg-zinc-100 text-[#0077B5] rounded-lg hover:bg-[#0077B5] hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative z-10 border-[12px] border-zinc-50">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Nova Leadership" />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl -z-0" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-black py-32 text-white">
        <div className="container mx-auto px-4">
          <header className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              The <span className="text-[#FF6B00]">Nova Standard</span>
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs mt-4">Clinical precision in hardware fulfillment</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Registry Verified", desc: "Every serial number is cross-referenced with manufacturer databases before entry into our local inventory." },
              { icon: Zap, title: "Kigali-Speed", desc: "Orders are processed through our primary node in Kigali Downtown, ensuring same-day deployment for local professionals." },
              { icon: HeartHandshake, title: "Trend Support", desc: "Physical technical assistance from our local engineering team. Your gear is never far from an expert handshake." }
            ].map((value, i) => (
              <div key={i} className="group p-12 bg-zinc-900/50 border border-zinc-800 rounded-[40px] hover:border-[#FF6B00]/50 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-4">{value.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Award className="w-16 h-16 text-[#FF6B00] mx-auto" />
          <h2 className="text-5xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
            Join the <span className="text-[#FF6B00]">Nova Wave.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium">Equip your talent with the hardware they deserve. Standardized by Nova Trend.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button onClick={() => navigate('/inventory')} className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-[#FF6B00] transition-all">Explore Inventory <ArrowRight className="w-5 h-5" /></button>
            <button onClick={handleContact} className="border-2 border-zinc-100 hover:border-[#FF6B00] text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all">Enterprise Inquiry</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;