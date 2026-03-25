import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background text-text-primary">
      {/* Header */}
      <section className="bg-primary-light py-24 relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-background opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/4 w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-display font-medium mb-6 text-white tracking-tight"
          >
            Contact <span className="italic text-text-secondary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto font-light"
          >
            We'd love to hear from you. Whether you have a question about our programs, volunteering, or donations, our team is ready to answer all your questions.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-16"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">Get in Touch</h2>
                <p className="text-xl text-text-secondary font-light leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. We're here to help you get involved and support our mission.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:text-accent transition-colors duration-500">
                    <MapPin size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white mb-2">Our Headquarters</h3>
                    <p className="text-text-secondary text-lg font-light leading-relaxed">123 Sports Avenue<br />Athletic District, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 group-hover:text-secondary-bright transition-colors duration-500">
                    <Phone size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white mb-2">Phone</h3>
                    <p className="text-text-secondary text-lg font-light mb-1">+1 (555) 123-4567</p>
                    <p className="text-text-secondary/60 text-sm uppercase tracking-wider font-bold">Mon-Fri from 9am to 5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors duration-500">
                    <Mail size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white mb-2">Email</h3>
                    <p className="text-text-secondary text-lg font-light">hello@sportssupport.org</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-card p-10 md:p-12 rounded-3xl"
            >
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-accent focus:bg-white/5 outline-none transition-all text-white font-light placeholder-text-secondary/50"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-accent focus:bg-white/5 outline-none transition-all text-white font-light placeholder-text-secondary/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-accent focus:bg-white/5 outline-none transition-all text-white font-light placeholder-text-secondary/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Subject</label>
                  <select
                    id="subject"
                    className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-accent focus:bg-white/5 outline-none transition-all text-white font-light appearance-none"
                  >
                    <option className="bg-primary text-white">General Inquiry</option>
                    <option className="bg-primary text-white">Volunteering</option>
                    <option className="bg-primary text-white">Donations</option>
                    <option className="bg-primary text-white">Partnerships</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-accent focus:bg-white/5 outline-none transition-all text-white font-light resize-none placeholder-text-secondary/50"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="w-full bg-white hover:bg-white/90 text-primary py-5 rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                >
                  Send Message <Send size={24} />
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
