import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Footer = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <footer className="relative bg-background text-white pt-24 pb-8 overflow-hidden border-t border-border">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16"
        >
          {/* Brand - Span 4 */}
          <motion.div variants={item} className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 border border-white/10 group-hover:scale-105 transition-transform">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wide uppercase leading-tight">
                Sports Support<br /><span className="text-text-secondary text-sm">Foundation</span>
              </span>
            </Link>
            <p className="text-text-secondary text-base leading-relaxed max-w-sm">
              Leveling the playing field. We believe every child deserves the opportunity to play, learn, and grow through sports.
            </p>
            <div className="flex space-x-3 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links - Span 2 */}
          <motion.div variants={item} className="lg:col-span-2">
            <h3 className="text-lg font-display font-bold mb-6 text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['About Us', 'Our Programs', 'Get Involved', 'Contact Us', 'Latest News'].map((link, idx) => (
                <li key={idx}>
                  <Link to="#" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-accent transition-all group-hover:w-4"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs - Span 3 */}
          <motion.div variants={item} className="lg:col-span-3">
            <h3 className="text-lg font-display font-bold mb-6 text-white tracking-wide">
              Our Programs
            </h3>
            <ul className="space-y-4">
              {['Youth Academies', 'Equipment Drives', 'Coaching Clinics', 'Community Tournaments', 'Scholarships'].map((link, idx) => (
                <li key={idx}>
                  <Link to="#" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-accent transition-all group-hover:w-4"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter - Span 3 */}
          <motion.div variants={item} className="lg:col-span-3">
            <h3 className="text-lg font-display font-bold mb-6 text-white tracking-wide">
              Stay in the Loop
            </h3>
            <p className="text-text-secondary mb-4 text-sm">Join our newsletter for updates on impact stories and events.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-surface border border-border rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-accent text-white transition-all group-hover:border-white/20"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-accent text-primary w-9 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">
                <Phone className="text-accent shrink-0" size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">
                <Mail className="text-accent shrink-0" size={16} />
                <span>hello@sportssupport.org</span>
              </li>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-text-secondary text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} Sports Support Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
