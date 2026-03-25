import { motion } from 'motion/react';
import { Heart, HandHeart, Users, Gift, ArrowRight } from 'lucide-react';

const GetInvolved = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background text-text-primary">
      {/* Header */}
      <section className="bg-primary-light py-24 relative overflow-hidden border-b border-border">
        {/* Deep animated background spots elements */}
        <div className="absolute top-0 right-1/4 w-[30vw] h-[30vw] bg-accent/20 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-display font-medium mb-6 text-white tracking-tight"
          >
            Get <span className="italic text-text-secondary">Involved</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto font-light"
          >
            Your support makes our programs possible. Join us in leveling the playing field for youth everywhere.
          </motion.p>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Donate */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-12 rounded-3xl flex flex-col h-full group hover:border-white/30 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150 group-hover:bg-accent/20"></div>

              <div className="w-20 h-20 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-accent/20 group-hover:text-accent transition-colors duration-500">
                <Heart size={40} fill="currentColor" />
              </div>
              <h2 className="text-4xl font-display font-medium text-white mb-6 relative z-10">Make a Donation</h2>
              <p className="text-text-secondary mb-10 text-xl font-light leading-relaxed flex-grow relative z-10">
                Your financial contribution directly funds our youth academies, equipment purchases, and community tournaments. Every dollar helps a child play.
              </p>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {['$25', '$50', '$100'].map((amount) => (
                    <button key={amount} className="py-4 border border-white/20 rounded-2xl font-bold text-white hover:border-accent hover:text-accent hover:bg-white/5 transition-all">
                      {amount}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-accent hover:bg-white text-primary py-5 rounded-2xl font-bold text-xl transition-all shadow-md flex items-center justify-center gap-3">
                  Donate Now <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>

            {/* Volunteer */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.15 }}
              className="glass-card p-12 rounded-3xl flex flex-col h-full group hover:border-white/30 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150 group-hover:bg-secondary/20"></div>

              <div className="w-20 h-20 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-secondary/20 group-hover:text-secondary-bright transition-colors duration-500">
                <Users size={40} />
              </div>
              <h2 className="text-4xl font-display font-medium text-white mb-6 relative z-10">Become a Volunteer</h2>
              <p className="text-text-secondary mb-10 text-xl font-light leading-relaxed flex-grow relative z-10">
                Give your time and expertise. We need coaches, mentors, event staff, and administrative help. Join our community of dedicated volunteers.
              </p>

              <div className="space-y-6 mt-auto relative z-10">
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-4 text-white font-light text-lg">
                    <div className="bg-secondary/20 border border-secondary/30 p-2 rounded-full shrink-0">
                      <HandHeart className="text-secondary-bright" size={20} />
                    </div>
                    Coach a youth team
                  </li>
                  <li className="flex items-center gap-4 text-white font-light text-lg">
                    <div className="bg-secondary/20 border border-secondary/30 p-2 rounded-full shrink-0">
                      <HandHeart className="text-secondary-bright" size={20} />
                    </div>
                    Help at community events
                  </li>
                  <li className="flex items-center gap-4 text-white font-light text-lg">
                    <div className="bg-secondary/20 border border-secondary/30 p-2 rounded-full shrink-0">
                      <HandHeart className="text-secondary-bright" size={20} />
                    </div>
                    Assist with equipment drives
                  </li>
                </ul>
                <button className="w-full bg-white hover:bg-white/80 text-primary py-5 rounded-2xl font-bold text-xl transition-all shadow-md flex items-center justify-center gap-3">
                  Sign Up to Volunteer <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="py-32 bg-primary-light border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 mx-auto glass-card text-white rounded-3xl flex items-center justify-center mb-10">
              <Gift size={48} />
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-medium text-white mb-8">Corporate <span className="italic text-text-secondary">Partnerships</span></h2>
            <p className="text-2xl text-text-secondary mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              Partner with us to make a lasting impact in your community. We offer various sponsorship levels for our programs and events, providing great visibility for your brand while supporting a worthy cause.
            </p>
            <button className="bg-white hover:bg-white/90 text-primary px-10 py-5 xl rounded-full font-bold text-lg transition-all hover:scale-105">
              Download Sponsorship Packet
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
