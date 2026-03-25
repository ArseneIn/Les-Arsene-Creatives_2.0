import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="font-display font-bold text-xl">
                Sports Support<br />Foundation
              </span>
            </Link>
            <p className="text-gray-300 mt-4 leading-relaxed">
              Empowering youth through sports. We believe every child deserves the opportunity to play, learn, and grow.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Our Programs</Link></li>
              <li><Link to="/get-involved" className="text-gray-300 hover:text-accent transition-colors">Get Involved</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-accent transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors">Latest News</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Our Programs
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Youth Academies</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Equipment Drives</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Coaching Clinics</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Community Tournaments</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-accent transition-colors">Scholarships</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0 mt-1" size={20} />
                <span className="text-gray-300">123 Sports Avenue, Athletic District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent shrink-0" size={20} />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent shrink-0" size={20} />
                <span className="text-gray-300">hello@sportssupport.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Sports Support Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
