import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = [
    'All',
    'Youth Academies',
    'Equipment Drives',
    'Coaching Clinics',
    'Community Tournaments',
    'Scholarships'
  ];

  const programs = [
    {
      title: "Youth Academies",
      category: "Youth Academies",
      description: "Comprehensive after-school sports programs focusing on skill development, teamwork, and academic support.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Professional coaching", "Academic tutoring", "Nutrition education", "Mentorship programs"]
    },
    {
      title: "Equipment Drives",
      category: "Equipment Drives",
      description: "Collecting and distributing new and gently used sports equipment to schools and community centers in need.",
      image: "https://images.unsplash.com/photo-1518605368461-1e1252220a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Annual community drives", "School partnerships", "Direct distribution", "Quality checks"]
    },
    {
      title: "Coaching Clinics",
      category: "Coaching Clinics",
      description: "Training volunteer coaches and parents to provide high-quality, safe, and positive sports experiences for youth.",
      image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Certification programs", "Safety training", "Positive coaching techniques", "Ongoing support"]
    },
    {
      title: "Community Tournaments",
      category: "Community Tournaments",
      description: "Organizing local sports events to bring communities together and showcase youth talent in a supportive environment.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Multi-sport events", "Family-friendly atmosphere", "Local business sponsorships", "Trophy ceremonies"]
    },
    {
      title: "Athletic Scholarships",
      category: "Scholarships",
      description: "Providing financial assistance to talented young athletes from low-income families to pursue their sports dreams and higher education.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Tuition assistance", "Travel grants", "Academic counseling", "College placement support"]
    }
  ];

  const filteredPrograms = activeFilter === 'All'
    ? programs
    : programs.filter(p => p.category === activeFilter);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background text-text-primary">
      {/* Header */}
      <section className="bg-primary-light py-24 relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-background opacity-50 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-display font-medium mb-6 text-white tracking-tight"
          >
            Our <span className="italic text-text-secondary">Programs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto font-light"
          >
            Discover how we're making a difference in communities across the country through sports.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-primary/80 backdrop-blur-xl border-b border-border sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Filter size={18} />
              <span className="font-bold uppercase tracking-widest text-xs">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === cat
                      ? 'bg-accent text-primary shadow-md shadow-accent/20'
                      : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-24 relative min-h-[60vh] overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-32"
            >
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
                  >
                    <div className="w-full lg:w-1/2">
                      <div className="relative rounded-3xl overflow-hidden glass-card group">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                        <div className="absolute top-6 left-6">
                          <span className="glass border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                            {program.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-8">
                      <h2 className="text-4xl md:text-5xl font-display font-medium text-white">{program.title}</h2>
                      <p className="text-xl text-text-secondary font-light leading-relaxed">{program.description}</p>

                      <ul className="space-y-4 pt-4">
                        {program.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-4">
                            <div className="bg-accent/10 border border-accent/20 p-2 rounded-full shrink-0">
                              <CheckCircle2 className="text-accent" size={18} />
                            </div>
                            <span className="text-white font-light text-lg">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-8">
                        <Link
                          to="/get-involved"
                          className="inline-flex items-center gap-3 bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
                        >
                          Support this Program <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-32 glass-card rounded-3xl">
                  <p className="text-text-secondary text-xl font-light">No programs found in this category.</p>
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="mt-6 text-accent font-bold hover:text-white transition-colors"
                  >
                    View all programs
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Programs;
