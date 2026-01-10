
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('titan_cookie_consent');
    if (!consent) {
      // Delay appearing for a better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('titan_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('titan_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[250] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-700">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-black border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-800">
              <Cookie className="text-[#FF8C00] w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Personalized Experience</h4>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-xl">
                We use cookies to remember your language preferences and provide targeted hardware deals. By continuing, you agree to our 
                <span className="text-[#FF8C00] font-bold mx-1 cursor-pointer hover:underline">Cookies Policy</span>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleDecline}
              className="flex-1 md:flex-none px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-100 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 md:flex-none px-8 py-3 bg-[#FF8C00] hover:bg-orange-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-900/20 transition-all active:scale-95"
            >
              Accept All
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="hidden md:flex p-2 text-zinc-600 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
