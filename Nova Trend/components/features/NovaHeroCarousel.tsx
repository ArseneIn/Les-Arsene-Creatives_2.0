
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NovaLogo from '../ui/NovaLogo';

interface Slide {
  type: 'video' | 'image';
  url: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    type: 'video',
    url: 'https://player.vimeo.com/external/494163967.hd.mp4?s=7b920199042b588373b9e40733d19129e927c95a&profile_id=175',
    title: 'EQUIP YOUR POTENTIAL.',
    subtitle: 'High-conversion professional hardware for Rwanda\'s elite workforce.'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=1920',
    title: 'THE FUTURE OF MOBILITY.',
    subtitle: 'Urban transit refined for Kigali. Access the new E-Bike fleet registry.'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618366712277-721219643115?auto=format&fit=crop&q=80&w=1920',
    title: 'CREATOR CORE.',
    subtitle: 'Studio-grade sound for Rwanda\'s elite. Standardized audio benchmarks.'
  }
];

interface NovaHeroCarouselProps {
  onAccessCatalog: () => void;
  onLaunchMatrix: () => void;
}

const NovaHeroCarousel: React.FC<NovaHeroCarouselProps> = ({ onAccessCatalog, onLaunchMatrix }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Handle manual node selection from indicators
  const handleNodeClick = (index: number) => {
    setCurrentIndex(index);
    // Restart timer to prevent immediate jump
    if (!isPaused) startTimer();
  };

  return (
    <section
      className="relative h-[70vh] md:h-[75vh] bg-slate-950 overflow-hidden border-b border-white/5 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Motion Engine: Smooth Cross-Fade with Transform Scaling */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === currentIndex
            ? 'opacity-100 scale-100 z-10'
            : 'opacity-0 scale-105 z-0'
            }`}
          style={{ willChange: 'opacity, transform' }}
        >
          {slide.type === 'video' ? (
            <video
              src={slide.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          ) : (
            <img
              src={slide.url}
              className="w-full h-full object-cover opacity-60"
              alt=""
            />
          )}

          {/* Vibrant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent pointer-events-none mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
        </div>
      ))}

      {/* Narrative Layer */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-nova-orange text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-lg shadow-orange-500/10 animate-float">
            <Activity className="w-3.5 h-3.5" /> Registry 2.0 // Live
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase italic leading-[0.85] tracking-tighter mb-8 brand-font drop-shadow-2xl text-glow transition-all duration-700">
            {SLIDES[currentIndex].title.split('.').map((part, i) => (
              <React.Fragment key={i}>
                {i === 1 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F00] to-[#FF8C00]">{part}</span> : part}
                {i === 0 && <br className="hidden sm:block" />}
              </React.Fragment>
            ))}
          </h1>

          <p className="text-xs sm:text-base md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed mb-12 uppercase tracking-widest drop-shadow-md">
            {SLIDES[currentIndex].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={onAccessCatalog}
              className="group relative px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 overflow-hidden bg-[#FF4F00] text-white shadow-[0_20px_50px_rgba(255,79,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,79,0,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10 flex items-center gap-2">Access Catalog <ChevronRight className="w-4 h-4" /></span>
            </button>
            <button
              onClick={onLaunchMatrix}
              className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-xl hover:border-white/20"
            >
              Launch Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Status Matrix: 3x3 Node Grid Indicators */}
      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-8 bg-black/40 backdrop-blur-md p-6 rounded-[32px] border border-white/5">
        <div className="grid grid-cols-3 gap-2.5">
          {[...Array(9)].map((_, i) => {
            // Strategic node mapping for slides
            const activeNodeIndex = currentIndex === 0 ? 4 : currentIndex === 1 ? 1 : 7;
            const isActive = i === activeNodeIndex;

            return (
              <button
                key={i}
                onClick={() => {
                  const slideIdx = i === 4 ? 0 : i === 1 ? 1 : i === 7 ? 2 : -1;
                  if (slideIdx !== -1) handleNodeClick(slideIdx);
                }}
                disabled={i !== 4 && i !== 1 && i !== 7}
                className={`w-2 h-2 rounded-full transition-all duration-700 cursor-default ${isActive
                  ? 'bg-nova-orange scale-150 shadow-[0_0_15px_#FF4F00] opacity-100'
                  : 'bg-white opacity-20'
                  } ${(i === 4 || i === 1 || i === 7) ? 'cursor-pointer hover:opacity-50' : 'pointer-events-none'}`}
              />
            );
          })}
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
            {isPaused ? 'Matrix Buffered' : 'Cycle Synced'}
          </div>
          <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
            <div
              key={currentIndex}
              className={`h-full bg-nova-orange transition-all ease-linear ${isPaused ? 'opacity-50' : 'animate-progress-fill'}`}
              style={{ animationDuration: '5s' }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-fill {
          animation-name: progress-fill;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default NovaHeroCarousel;
