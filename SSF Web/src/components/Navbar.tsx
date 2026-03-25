import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Phone, Mail } from 'lucide-react';

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
    <header className="fixed w-full top-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-accent text-white text-sm py-3.5 hidden sm:block w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>hello@sportssupport.org</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white/80 transition-colors">Support</Link>
            <Link to="/about" className="hover:text-white/80 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className={`transition-all duration-300 w-full ${isScrolled ? 'px-0 pt-0' : 'px-4 sm:px-6 lg:px-8 pt-4'}`}>
        <nav className={`bg-white shadow-lg transition-all duration-300 mx-auto ${isScrolled ? 'w-full rounded-none' : 'max-w-7xl rounded-full'}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <span className="font-display font-bold text-xl text-primary">
                    Sports Support<br />Foundation
                  </span>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-medium transition-colors hover:text-accent ${
                      isActive(link.path) ? 'text-accent' : 'text-gray-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/get-involved"
                  className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Donate Now
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-primary focus:outline-none"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg rounded-b-2xl left-0">
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? 'text-accent bg-orange-50'
                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 px-3">
                  <Link
                    to="/get-involved"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-accent text-white px-6 py-3 rounded-full font-semibold"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
