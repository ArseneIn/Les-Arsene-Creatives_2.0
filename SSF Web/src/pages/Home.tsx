import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, Trophy, Users, Target } from 'lucide-react';
import { motion } from 'motion/react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center pt-32 pb-24 lg:pt-40 lg:pb-32">
        {/* Background Image with Purple Gradient Overlay and Abstract Shapes */}
        <div className="absolute inset-0 z-0 bg-primary">
          <img
            src="https://images.unsplash.com/photo-1518605368461-1e1252220a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Youth playing basketball"
            className="w-full h-full object-cover grayscale opacity-40"
            referrerPolicy="no-referrer"
          />
          {/* Purple fading from down left corner */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-primary/10"></div>
          
          {/* Abstract Shapes Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large Circle */}
            <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full border-[40px] border-white/5 opacity-30"></div>
            {/* Accent Circle */}
            <div className="absolute top-[60%] -left-[10%] w-[40vw] h-[40vw] rounded-full border-[20px] border-accent/20 opacity-40"></div>
            {/* Dot Pattern */}
            <div className="absolute top-[20%] left-[15%] w-32 h-32 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            {/* Organic Shape */}
            <svg className="absolute bottom-[15%] right-[20%] w-64 h-64 text-accent/10 transform rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.7,-18.1,97.2,-2.5C97.7,13.1,92.8,29,83.4,42.4C74,55.8,60.1,66.7,45.3,74.6C30.5,82.5,15.2,87.4,-0.4,88.1C-16.1,88.8,-32.2,85.3,-46.1,77.2C-60,69.1,-71.7,56.4,-80.4,41.7C-89.1,27,-94.8,10.3,-93.8,-5.8C-92.8,-21.9,-85.1,-37.4,-74.2,-49.6C-63.3,-61.8,-49.2,-70.7,-34.8,-77.5C-20.4,-84.3,-5.7,-89,9.4,-87.3C24.5,-85.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-sm font-semibold text-white tracking-wide uppercase">Active in 15+ Cities</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-[80px] font-display font-extrabold leading-[0.9] tracking-tight text-white mb-8">
              Leveling the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400 inline-block mt-2 pb-2">
                Playing Field.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              We believe every child deserves the opportunity to play, learn, and grow through sports, regardless of their background.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/get-involved"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-accent rounded-full overflow-hidden transition-all hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1"
              >
                <span className="relative flex items-center gap-2">
                  Donate Now <Heart size={20} className="group-hover:scale-110 transition-transform" />
                </span>
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full hover:bg-white/20 transition-all"
              >
                Explore Programs <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-white shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">10k+</h3>
              <p className="text-gray-600 font-medium">Youth Reached</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-white shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600 font-medium">Programs Active</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-white shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">15</h3>
              <p className="text-gray-600 font-medium">Cities Served</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-xl bg-white shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">$2M</h3>
              <p className="text-gray-600 font-medium">Funds Raised</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1515523110800-9415d13b84a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Children playing basketball" 
                  className="rounded-lg shadow-xl relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent rounded-lg -z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-0"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Our Mission</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                Building Character Through <span className="text-accent">Competition</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We provide underprivileged youth with access to sports equipment, coaching, and facilities. We believe that sports teach invaluable life lessons: teamwork, resilience, leadership, and discipline.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Providing free sports equipment to schools in need',
                  'Organizing community leagues and tournaments',
                  'Funding scholarships for talented young athletes',
                  'Training and certifying volunteer coaches'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent shrink-0 mt-1" size={24} />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-accent transition-colors group"
              >
                Read Our Full Story 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Testimonials</h2>
            <h3 className="text-4xl font-display font-bold text-gray-900">Voices of Our Community</h3>
          </div>

          <div className="relative">
            {/* Carousel Track */}
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                {
                  quote: "The equipment provided by the foundation completely transformed our after-school program. The kids finally have what they need to play safely.",
                  author: "Sarah Jenkins",
                  role: "Community Center Director",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                {
                  quote: "My son found his passion for basketball through their youth academy. The coaches are incredible mentors who teach life skills, not just sports.",
                  author: "Marcus Williams",
                  role: "Parent",
                  image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                {
                  quote: "Partnering with Sports Support Foundation has been one of our most rewarding corporate initiatives. Their impact on local youth is visible and profound.",
                  author: "Elena Rodriguez",
                  role: "Corporate Sponsor",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                {
                  quote: "I started playing soccer because of their equipment drive. Now I'm playing in college on a scholarship. I owe so much to this organization.",
                  author: "David Chen",
                  role: "Former Participant",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] bg-accent p-8 rounded-xl snap-center border border-accent shadow-sm flex flex-col"
                >
                  <div className="text-white/50 mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.41 14.596C16.634 13.985 16.75 13.34 16.75 12.684V3H23V12.684C23 15.68 21.986 18.49 19.89 20.65L14.017 21ZM3.017 21L5.41 14.596C5.634 13.985 5.75 13.34 5.75 12.684V3H12V12.684C12 15.68 10.986 18.49 8.89 20.65L3.017 21Z" />
                    </svg>
                  </div>
                  <p className="text-white text-lg mb-8 italic leading-relaxed flex-grow">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={testimonial.image} alt={testimonial.author} className="w-14 h-14 rounded-full object-cover border-2 border-white/20" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-white">{testimonial.author}</h4>
                      <p className="text-sm text-white/80">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Gradient Fades for Carousel */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-wave opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Your support helps us provide equipment, facilities, and coaching to children who need it most. Join our team today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/get-involved"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Become a Volunteer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  Stay in the Loop
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Subscribe to our newsletter to get the latest updates on our programs, upcoming events, and stories of impact from the communities we serve.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-grow px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
              <div className="hidden lg:block relative">
                <img 
                  src="https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Kids cheering" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
