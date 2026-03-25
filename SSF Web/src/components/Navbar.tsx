import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 flex flex-col transition-all duration-500"
    >
      {/* Top Bar */}
      <div className="bg-primary border-b border-border text-text-secondary text-xs py-2 hidden sm:block w-full backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} className="text-accent" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Mail size={12} className="text-accent" />
              <span>hello@sportssupport.org</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
            <Link to="/about" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className={`transition-all duration-500 w-full ${isScrolled ? 'px-0 pt-0' : 'px-4 sm:px-6 lg:px-8 pt-4'}`}>
        <nav className={`transition-all duration-500 mx-auto ${isScrolled ? 'w-full glass rounded-none border-x-0 border-t-0 border-b border-border' : 'max-w-7xl glass-card rounded-2xl'}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-3 group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 border border-white/10"
                  >
                    <Heart size={20} fill="currentColor" />
                  </motion.div>
                  <span className="font-display font-bold text-xl text-white tracking-wide uppercase leading-tight">
                    Sports Support<br /><span className="text-text-secondary text-sm">Foundation</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive(link.path) ? 'text-white' : 'text-text-secondary hover:text-white'
                      }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
                <div className="pl-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/get-involved"
                      className="bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-primary px-6 py-2.5 rounded-full font-bold transition-all shadow-md shadow-accent/10 text-sm tracking-wide uppercase"
                    >
                      Donate
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white hover:text-accent focus:outline-none p-2"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden glass border-t border-border overflow-hidden"
              >
                <div className="px-4 py-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.path)
                          ? 'text-accent bg-accent/10 border border-accent/20'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-6">
                    <Link
                      to="/get-involved"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-accent text-primary px-6 py-4 rounded-xl font-bold uppercase tracking-wide"
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
