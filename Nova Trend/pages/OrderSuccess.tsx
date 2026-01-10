import React, { useEffect } from 'react';
import { CheckCircle2, Package, Truck, ShieldCheck, ArrowRight, ShoppingBag, MapPin, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, customerName, phoneNumber } = location.state || {
    orderId: 'DEMO-123',
    customerName: 'Valued Customer',
    phoneNumber: 'your registered number'
  };

  useEffect(() => {
    // Trigger Confetti Celebration
    if (typeof (window as any).confetti === 'function') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        (window as any).confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        (window as any).confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black pt-20 pb-32 flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-4xl text-center">

        {/* Visual: Large Green Checkmark animation */}
        <div className="relative mb-12 flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-700 shadow-xl shadow-emerald-900/5 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-glow" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-black">
            Order <span className="text-emerald-600">#{orderId}</span> Confirmed!
          </h1>

          {/* Subtext */}
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-xl mx-auto leading-relaxed">
            Thank you, <span className="text-black">{customerName}</span>. We have sent a confirmation via WhatsApp to <span className="text-black">{phoneNumber}</span>.
          </p>
        </div>

        {/* Process Card */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-[40px] p-8 md:p-12 mb-12 text-left shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-zinc-200 z-0" />

            {[
              {
                icon: ShieldCheck,
                title: 'Quality Check',
                desc: "Final diagnostics being performed on your hardware."
              },
              {
                icon: Package,
                title: 'Safe Armor',
                desc: 'Shock-proof packaging for secure Rwanda-wide transit.'
              },
              {
                icon: Truck,
                title: 'Outbound',
                desc: 'Our local courier will ping you via WhatsApp for final drop-off.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 shadow-lg">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 mb-1">Step {idx + 1}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-bold uppercase">
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action: Two buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/track/${orderId}`)}
            className="bg-black hover:bg-zinc-800 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
          >
            <Search className="w-4 h-4 text-emerald-400" /> Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="border-2 border-zinc-200 hover:border-black text-zinc-500 hover:text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-50">
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            "Standardizing Rwanda's Hardware Experience"
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
