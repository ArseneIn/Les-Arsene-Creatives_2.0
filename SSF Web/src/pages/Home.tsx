import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Target, Activity, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';

const RevealText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={`overflow-hidden flex flex-wrap gap-[0.2em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0, rotate: 5 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
          className="inline-block origin-bottom-left"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </div>
  );
};

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Hero Section - Redesigned for Density and Asymmetry */}
      <section ref={heroRef} style={{ position: "relative" }} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Deep animated background spots elements */}
        <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-primary-light/40 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-accent/20 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 pt-10">

            {/* Left Content */}
            <motion.div style={{ opacity: opacityHero }} className="lg:w-[55%] flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-text-secondary">Empowering 15+ Cities Globally</span>
              </motion.div>

              <h1 className="text-6xl sm:text-7xl lg:text-[85px] xl:text-[100px] font-display font-medium leading-[0.95] text-white mb-8 tracking-tighter">
                <RevealText text="Leveling" delay={0.1} />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary italic block pr-4 py-2">
                  <RevealText text="The Playing" delay={0.3} />
                </span>
                <RevealText text="Field." delay={0.6} />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-xl md:text-2xl text-text-secondary mb-12 max-w-xl font-light leading-relaxed"
              >
                Every child deserves the opportunity to play, learn, and grow. We provide the equipment and coaching to make it happen.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto z-20"
              >
                <Link
                  to="/get-involved"
                  className="relative group px-10 py-5 bg-white text-primary rounded-full overflow-hidden w-full sm:w-auto text-center"
                >
                  <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out"></div>
                  <span className="relative font-bold text-lg group-hover:text-white transition-colors duration-300">Donate Now</span>
                </Link>
                <Link
                  to="/programs"
                  className="px-10 py-5 glass-card rounded-full text-white hover:bg-white/5 transition-all w-full sm:w-auto border border-white/10 hover:border-white/30 text-center font-bold text-lg flex items-center justify-center gap-3 group"
                >
                  Explore Programs <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Visuals - Dynamic Stacked Layout */}
            <div className="lg:w-[45%] relative w-full h-[600px] lg:h-[700px] hidden lg:block">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[80%] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,154,18,0.1)] z-10"
              >
                <div className="absolute inset-0 bg-primary/30 mix-blend-overlay z-10 pointer-events-none"></div>
                <img
                  src="https://images.unsplash.com/photo-1518605368461-1e1252220a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Youth playing basketball"
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Floating Card 1: Impact */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: -20 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 1, delay: 1 },
                  x: { duration: 1, delay: 1 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                className="absolute top-24 right-0 z-20 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center shadow-lg shadow-accent/20">
                    <Target size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-medium text-white mb-1">10k+</p>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">Youth Reached</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2: Active Programs */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                transition={{
                  opacity: { duration: 1, delay: 1.2 },
                  x: { duration: 1, delay: 1.2 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                }}
                className="absolute bottom-32 left[-20px] z-20 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-4">
                    <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" className="w-14 h-14 rounded-full border-2 border-primary object-cover grayscale" referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" className="w-14 h-14 rounded-full border-2 border-primary object-cover grayscale" referrerPolicy="no-referrer" />
                    <div className="w-14 h-14 rounded-full border-2 border-primary bg-primary-light flex items-center justify-center">
                      <span className="text-white text-sm font-bold">+50</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Programs</p>
                    <p className="text-text-secondary text-sm">Across 15 Cities</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats Section */}
      <section className="py-24 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* Big Feature Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="md:col-span-2 lg:col-span-2 row-span-2 glass-card rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-700 group-hover:scale-150 group-hover:bg-secondary/20"></div>
              <div>
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="text-secondary-bright" size={28} />
                </div>
                <h3 className="text-6xl font-display font-medium mb-4">10k+</h3>
              </div>
              <div>
                <p className="text-xl font-bold text-white mb-2">Youth Reached Globally</p>
                <p className="text-text-secondary leading-relaxed">Providing direct access to athletic facilities, coaching clinics, and necessary sports gear.</p>
              </div>
            </motion.div>

            {/* Sub Block 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-accent/20"></div>
              <Trophy className="text-accent mb-4" size={32} />
              <div>
                <h3 className="text-4xl font-display font-medium mb-1">50+</h3>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-wide">Active Programs</p>
              </div>
            </motion.div>

            {/* Sub Block 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between md:col-span-2 lg:col-span-1 row-span-1 lg:row-span-2 overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Kids playing" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20"></div>
              <div className="relative z-10 mt-auto">
                <Target className="text-white mb-4" size={32} />
                <h3 className="text-4xl font-display font-medium mb-1">15</h3>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-wide">Cities Served</p>
              </div>
            </motion.div>

            {/* Sub Block 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary-light/50 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"></div>
              <Users className="text-white mb-4" size={32} />
              <div>
                <h3 className="text-4xl font-display font-medium mb-1 text-gradient-primary">$2M</h3>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-wide">Funds Raised</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Sticky Mission Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sticky Text Side */}
            <div className="lg:w-1/2 lg:sticky top-40 h-fit">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Who We Are</span>
              <h2 className="text-5xl md:text-7xl font-display font-medium leading-[1.1] mb-10 text-white">
                Our <span className="italic text-text-secondary">Mission</span> <br />& <span className="text-accent">Vision</span>
              </h2>

              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                  <p className="text-xl text-text-secondary font-light leading-relaxed max-w-lg">
                    To build stronger, peaceful and more inclusive communities by using sport to break down barriers, champion equality, and provide holistic support to vulnerable groups.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                  <p className="text-xl text-text-secondary font-light leading-relaxed max-w-lg">
                    A society free from injustice, where sport has broken cycles of inequality and created a unified community built on mutual respect, health, and resilience.
                  </p>
                </div>
              </div>

              <Link to="/about" className="inline-flex items-center gap-3 text-white font-bold text-lg hover:text-accent transition-colors group mt-12">
                Read Our Story
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:translate-x-2 transition-all">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            {/* Scrolling Image & List Side */}
            <div className="lg:w-1/2 space-y-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] rounded-3xl overflow-hidden glass-card p-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1515523110800-9415d13b84a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Children playing"
                  className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>

              <div className="space-y-6 pt-10">
                {[
                  'Providing free sports equipment to schools in need',
                  'Organizing community leagues and tournaments',
                  'Funding scholarships for talented young athletes',
                  'Training and certifying volunteer coaches'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-6 glass-card rounded-2xl hover:bg-white/5 transition-colors"
                  >
                    <div className="bg-accent/10 border border-accent/20 p-2 rounded-full shrink-0">
                      <CheckCircle2 className="text-accent" size={20} />
                    </div>
                    <span className="text-lg text-white font-light">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Testimonials Carousel - Light Theme Inversion */}
      <section className="py-32 relative bg-[#f8fafc] text-neutral-900 overflow-hidden border-y border-white/10">
        {/* Massive background text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-[0.03] pointer-events-none font-display text-[20vw] font-bold text-black">
          IMPACT VOICES
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Testimonials</span>
              <h2 className="text-5xl lg:text-6xl font-display font-medium text-black">Voices of Our <br /><span className="italic text-neutral-400">Community</span></h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}">
            {[
              {
                quote: "The equipment provided by the foundation completely transformed our after-school program.",
                author: "Sarah Jenkins",
                role: "Community Director"
              },
              {
                quote: "My son found his passion for basketball through their youth academy. The coaches are incredible mentors.",
                author: "Marcus Williams",
                role: "Parent"
              },
              {
                quote: "I started playing soccer because of their equipment drive. Now I'm playing in college.",
                author: "David Chen",
                role: "Former Participant"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="min-w-[320px] md:min-w-[450px] p-10 bg-white rounded-3xl snap-center flex flex-col group border border-neutral-200 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className="text-primary opacity-30 mb-8 group-hover:opacity-100 group-hover:text-accent transition-colors duration-500">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21L16.41 14.596C16.634 13.985 16.75 13.34 16.75 12.684V3H23V12.684C23 15.68 21.986 18.49 19.89 20.65L14.017 21ZM3.017 21L5.41 14.596C5.634 13.985 5.75 13.34 5.75 12.684V3H12V12.684C12 15.68 10.986 18.49 8.89 20.65L3.017 21Z" />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl font-light mb-12 flex-grow leading-relaxed text-neutral-800">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                  <div>
                    <h4 className="font-bold text-black text-lg">{testimonial.author}</h4>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mt-1 font-bold">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Premium CTA */}
      <section className="pt-32 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/20 rounded-[100%] blur-[120px] pointer-events-none translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-display font-medium text-white mb-8 tracking-tighter">
              Ready to <span className="italic text-text-secondary">Make a</span> <br />Difference?
            </h2>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-light">
              Your support helps us provide equipment, facilities, and coaching to children who need it most.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/get-involved"
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:scale-105"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="glass-card text-white px-10 py-5 xl rounded-full font-bold text-lg hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
              >
                Become a Volunteer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
