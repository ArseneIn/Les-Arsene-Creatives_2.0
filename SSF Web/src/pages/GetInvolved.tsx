import { motion } from 'motion/react';
import { Heart, HandHeart, Users, Gift, ArrowRight } from 'lucide-react';

const GetInvolved = () => {
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
            Get Involved
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Your support makes our programs possible. Join us in leveling the playing field for youth everywhere.
          </motion.p>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Donate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-xl shadow-md border border-gray-100 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Make a Donation</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed flex-grow">
                Your financial contribution directly funds our youth academies, equipment purchases, and community tournaments. Every dollar helps a child play.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['$25', '$50', '$100'].map((amount) => (
                    <button key={amount} className="py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-accent hover:text-accent transition-colors">
                      {amount}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Donate Now <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>

            {/* Volunteer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-xl shadow-md border border-gray-100 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Become a Volunteer</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed flex-grow">
                Give your time and expertise. We need coaches, mentors, event staff, and administrative help. Join our community of dedicated volunteers.
              </p>
              
              <div className="space-y-4 mt-auto">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <HandHeart className="text-primary" size={20} /> Coach a youth team
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <HandHeart className="text-primary" size={20} /> Help at community events
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <HandHeart className="text-primary" size={20} /> Assist with equipment drives
                  </li>
                </ul>
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Sign Up to Volunteer <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-6">
              <Gift size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Corporate Partnerships</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Partner with us to make a lasting impact in your community. We offer various sponsorship levels for our programs and events, providing great visibility for your brand while supporting a worthy cause.
            </p>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl">
              Download Sponsorship Packet
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
