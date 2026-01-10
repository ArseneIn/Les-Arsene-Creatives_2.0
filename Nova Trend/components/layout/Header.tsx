import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { supabase } from '../../lib/api';
import NovaLogo from '../ui/NovaLogo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const {
    isAuthenticated,
    isClientAuthenticated,
    clientName,
    logout
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutAction = async () => {
    await supabase.auth.signOut();
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isUserAuthenticated = isAuthenticated || isClientAuthenticated;

  return (
    <header className="sticky top-0 z-[60] bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Brand Core */}
        <div
          className="cursor-pointer group shrink-0"
          onClick={() => navigate('/')}
        >
          <NovaLogo size={34} theme="dark" variant="full" />
        </div>

        {/* Technical Registry Search */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search technical registry..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2 pl-11 pr-4 text-[10px] focus:outline-none focus:border-nova-orange transition-all text-slate-100 placeholder:text-slate-500 font-bold uppercase tracking-[0.2em]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          </div>
        </div>

        {/* Interaction Node */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden sm:block">
            <ThemeToggle darkMode={theme === 'dark'} onToggle={toggleTheme} />
          </div>

          {isUserAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-nova-orange transition-colors shadow-lg">
                  <NovaLogo size={22} variant="mark" theme="dark" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[8px] font-black text-nova-orange uppercase tracking-widest leading-none mb-1">Session Active</p>
                  <p className="text-[10px] font-bold text-white truncate max-w-[100px]">{clientName.split(' ')[0]}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-nova-orange' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-slate-900 border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                  <div className="p-6 border-b border-white/5 bg-black/40">
                    <p className="text-[10px] font-black text-nova-orange uppercase tracking-[0.4em] mb-2 brand-font">Handshake Identity</p>
                    <p className="text-sm font-bold text-white truncate italic">{clientName}</p>
                  </div>

                  <div className="p-3 space-y-1">
                    <button
                      onClick={() => { navigate(isAuthenticated ? '/admin' : '/client-dashboard'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-nova-orange" />
                      {isAuthenticated ? 'REGISTRY CONTROL' : 'TREND LIBRARY'}
                    </button>
                  </div>

                  <div className="p-3 border-t border-white/5">
                    <button
                      onClick={handleLogoutAction}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-red-400 bg-red-950/20 hover:bg-red-900/40 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                      <LogOut className="w-4 h-4" /> TERMINATE SESSION
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-slate-100 transition-all group shadow-[0_10px_20px_rgba(255,255,255,0.1)] active:scale-95 border border-white"
              onClick={() => navigate('/login')}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest brand-font">Login / Register</span>
            </button>
          )}

          <button
            className="relative p-2 text-slate-400 hover:text-nova-orange transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-nova-orange text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center shadow-lg transform translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </button>

          <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Registry Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-white/5 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {!isUserAuthenticated && (
            <button
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-nova-orange text-white font-black uppercase text-xs tracking-widest"
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
            >
              <User className="w-5 h-5" /> INITIALIZE LOGIN
            </button>
          )}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { navigate('/best-sellers'); setIsMobileMenuOpen(false); }} className="p-4 bg-slate-900 rounded-xl text-[10px] font-black uppercase text-slate-400">Registry</button>
            <button onClick={() => { navigate('/gaming'); setIsMobileMenuOpen(false); }} className="p-4 bg-slate-900 rounded-xl text-[10px] font-black uppercase text-slate-400">Gaming</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
