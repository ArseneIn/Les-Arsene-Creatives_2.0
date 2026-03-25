import { motion } from 'motion/react';
import { Target, Heart, Shield, Zap } from 'lucide-react';

const About = () => {
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
            About Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Dedicated to transforming lives through the power of sports since 2010.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  The Sports Support Foundation began with a simple observation: talent is universal, but opportunity is not. Our founders, a group of former collegiate athletes, noticed that many children in their local communities were missing out on the benefits of organized sports simply due to the cost of equipment and league fees.
                </p>
                <p>
                  What started as a small local equipment drive in 2010 has grown into a nationwide movement. We believe that sports are more than just games; they are classrooms where children learn resilience, teamwork, leadership, and discipline.
                </p>
                <p>
                  Today, we partner with schools, community centers, and local sports leagues across 15 cities to ensure that every child who wants to play, has the chance to play.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbb1925536?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Team huddle" 
                className="rounded-lg shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-lg max-w-xs">
                <p className="text-xl font-bold text-primary mb-2">"Sports have the power to change the world."</p>
                <p className="text-gray-500 text-sm">- Nelson Mandela</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">These principles guide everything we do, from the programs we design to the partnerships we build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Inclusivity', desc: 'Sports are for everyone. We break down barriers to entry.' },
              { icon: Heart, title: 'Compassion', desc: 'We lead with empathy and care for the communities we serve.' },
              { icon: Shield, title: 'Integrity', desc: 'We operate with transparency and hold ourselves accountable.' },
              { icon: Zap, title: 'Empowerment', desc: 'We build confidence and leadership skills in youth.' },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Our Team</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">Meet the People Behind the Mission</h3>
            <p className="text-lg text-gray-600">
              Our dedicated team of former athletes, educators, and community leaders work tirelessly to ensure every child has the opportunity to play.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Michael Thompson",
                role: "Founder & Executive Director",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "A former D1 basketball player, Michael founded the organization after seeing talented kids in his hometown miss out on sports due to financial barriers."
              },
              {
                name: "Sarah Jenkins",
                role: "Director of Programs",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "With 15 years in educational non-profits, Sarah designs our community outreach programs to ensure they deliver both athletic and academic value."
              },
              {
                name: "David Chen",
                role: "Head of Partnerships",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "David leverages his corporate background to connect sponsors with local community needs, securing the funding that keeps our leagues running."
              },
              {
                name: "Elena Rodriguez",
                role: "Community Coordinator",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "A former participant in our youth programs, Elena now works on the ground to ensure our equipment reaches the schools and leagues that need it most."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col items-center text-center bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative overflow-hidden w-full aspect-[4/5] mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-6 pb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-accent font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
