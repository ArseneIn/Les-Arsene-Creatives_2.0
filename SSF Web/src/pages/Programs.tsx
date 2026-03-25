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
    <div className="flex flex-col min-h-screen pt-20">
      {/* Header */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-wave opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Our Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Discover how we're making a difference in communities across the country through sports.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter size={18} />
              <span className="font-semibold uppercase tracking-wider text-xs">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === cat
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <section className="py-20 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-24"
            >
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                  >
                    <div className="w-full lg:w-1/2">
                      <div className="relative rounded-lg overflow-hidden shadow-lg group">
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {program.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 space-y-6">
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">{program.title}</h2>
                      <p className="text-lg text-gray-600 leading-relaxed">{program.description}</p>
                      
                      <ul className="space-y-3 pt-4">
                        {program.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-3">
                            <CheckCircle2 className="text-accent shrink-0" size={20} />
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-6">
                        <Link
                          to="/get-involved"
                          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                          Support this Program <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-xl">No programs found in this category.</p>
                  <button 
                    onClick={() => setActiveFilter('All')}
                    className="mt-4 text-primary font-bold hover:underline"
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
