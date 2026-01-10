
import React from 'react';
import { ArrowLeft, Printer, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import NovaLogo from '../components/ui/NovaLogo';

import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    { id: 'collection', title: '1. Data We Collect' },
    { id: 'usage', title: '2. How We Use Data' },
    { id: 'security', title: '3. Data Security' },
    { id: 'rwandan-law', title: '4. Rwandan Law Compliance' },
    { id: 'contact', title: '5. Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-[#333333] font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Header Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 print:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#FF6B00] font-bold text-sm hover:translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Last Updated: November 12, 2024
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        {/* Table of Contents Sidebar */}
        <aside className="lg:w-64 shrink-0 lg:sticky lg:top-32 h-fit print:hidden">
          <h4 className="text-black font-black uppercase text-xs tracking-widest mb-6 pb-2 border-b border-zinc-100">Contents</h4>
          <nav className="space-y-4">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="block text-left text-sm font-medium hover:text-[#FF6B00] transition-colors"
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Document Content */}
        <article className="max-w-3xl flex-1 print:max-w-full">
          <div className="hidden print:block mb-10">
            <NovaLogo variant="mark" theme="light" size={60} />
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-6">
              Nova Trend | <span className="text-[#FF6B00]">Privacy Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              At Nova Trend, your privacy is a foundational pillar of our service. We are committed to being transparent about how we handle your digital footprint and personal information.
            </p>
          </header>

          <section id="collection" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">1. Data We Collect</h2>
            <p>To provide elite hardware and seamless delivery, we collect specific personal datasets during your interaction with our platform:</p>
            <ul className="space-y-3 list-none">
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Identity Data:</strong> Full legal names for invoicing and warranty registration.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Contact & Delivery:</strong> Physical shipping addresses, active mobile numbers (MoMo), and email addresses.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Payment References:</strong> Transaction IDs and MoMo reference codes. <em>Note: We never store PINs or full credit card numbers.</em></span>
              </li>
            </ul>
          </section>

          <section id="usage" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">2. How We Use Data</h2>
            <p>Your data is processed strictly for fulfillment and support purposes:</p>
            <ul className="space-y-3 list-none">
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Order Fulfillment:</strong> Processing payments and managing shipping logistics.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Notifications:</strong> Automated SMS and WhatsApp triggers to update you on delivery status (tracking links via the Trend Registry).</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span><strong>Warranty Support:</strong> Maintaining a record of your hardware's Serial Number (SN) for lifetime manufacturer claims.</span>
              </li>
            </ul>
          </section>

          <section id="security" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">3. Data Security</h2>
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex gap-6 items-start">
              <ShieldCheck className="w-12 h-12 text-[#FF6B00] shrink-0" />
              <div>
                <p className="font-bold text-black mb-2 uppercase text-sm">Encrypted Infrastructure</p>
                <p className="text-sm leading-relaxed">
                  All transaction data is transmitted via AES-256 encrypted tunnels. Payment processing is handled by certified third-party gateways; Nova Trend does not have direct access to your financial credentials.
                </p>
              </div>
            </div>
          </section>

          <section id="rwandan-law" className="space-y-6 mb-12">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">4. Rwandan Law Compliance</h2>
            <p>
              Nova Trend strictly adheres to <strong>Law No. 058/2021 of 13/10/2021</strong> relating to the Protection of Personal Data and Privacy in the Republic of Rwanda.
            </p>
            <p>
              You have the right to request access to your data, correction of inaccuracies, or the total erasure of your customer profile from our database, provided there are no active warranty or legal requirements for retention.
            </p>
          </section>

          <section id="contact" className="space-y-6 mb-16">
            <h2 className="text-2xl font-black text-black uppercase italic border-l-4 border-[#FF6B00] pl-4">5. Contact Information</h2>
            <p>For any data-related inquiries or privacy requests, please contact our Data Protection Officer:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border border-zinc-100 rounded-xl">
                <Mail className="text-[#FF6B00] w-5 h-5" />
                <span className="text-sm font-bold">privacy@novatrend.rw</span>
              </div>
              <div className="flex items-center gap-3 p-4 border border-zinc-100 rounded-xl">
                <Phone className="text-[#FF6B00] w-5 h-5" />
                <span className="text-sm font-bold">+250 78x xxx xxx</span>
              </div>
            </div>
          </section>

          <div className="border-t border-zinc-100 pt-12 flex justify-between items-center print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] font-bold uppercase text-[10px] tracking-widest transition-colors"
            >
              <Printer className="w-4 h-4" /> Print this Document
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF6B00] text-white px-8 py-4 rounded-xl font-black uppercase text-xs shadow-xl shadow-orange-900/10 active:scale-95 transition-all"
            >
              Accept & Continue
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
