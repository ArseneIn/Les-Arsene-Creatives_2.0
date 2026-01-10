
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// Fixed: Removed non-existent 'Tool' icon and consolidated 'CheckCircle2' and 'X' into the main import block
import {
  ChevronDown,
  ShieldCheck,
  Truck,
  RefreshCw,
  AlertCircle,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  X
} from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-black group-hover:text-orange-600 transition-colors">{title}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="text-zinc-600 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const Policies: React.FC = () => {
  const { type } = useParams<{ type: 'shipping' | 'returns' | 'warranty' }>();

  const renderContent = () => {
    switch (type) {
      case 'shipping':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <header className="mb-16 text-center">
              <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-2xl mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-4">
                Fast, Safe, and <span className="text-orange-600">Reliable</span> Tech Delivery.
              </h1>
              <p className="text-zinc-500 font-medium">Your premium hardware, handled with professional precision.</p>
            </header>

            <div className="space-y-2">
              <Accordion title="Kigali Same-Day Delivery">
                <p>We prioritize local deliveries within Kigali to get your tools in your hands faster.</p>
                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg my-4">
                  <p className="text-orange-900 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Important Note
                  </p>
                  <p className="text-orange-800 text-sm">Orders placed before 2:00 PM are guaranteed to be delivered by 6:00 PM the same day.</p>
                </div>
              </Accordion>

              <Accordion title="Upcountry Delivery">
                <p>For our customers outside of Kigali, we partner with the most trusted courier services in Rwanda.</p>
                <ul className="list-none space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2" />
                    <span>Estimated delivery time: 24-48 hours.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2" />
                    <span>Full insurance coverage during transit for your peace of mind.</span>
                  </li>
                </ul>
              </Accordion>

              <Accordion title="Professional Packaging">
                <p>Electronics are sensitive. We don't just "box" them—we armor them.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex gap-4 p-4 border border-zinc-100 rounded-xl">
                    <Package className="w-10 h-10 text-orange-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-black mb-1">Anti-Static Protection</h4>
                      <p className="text-xs text-zinc-500">Prevents electrostatic discharge during handling.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 border border-zinc-100 rounded-xl">
                    <ShieldCheck className="w-10 h-10 text-orange-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-black mb-1">Shock-Proof Armor</h4>
                      <p className="text-xs text-zinc-500">Multi-layered cushioning against drops and impacts.</p>
                    </div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Real-Time Tracking">
                <p>Transparency is key to our customer success promise.</p>
                <p>Once your order leaves our warehouse, you will receive an automated SMS and Email containing a direct tracking link. You can monitor your hardware's journey from our hands to your doorstep.</p>
              </Accordion>
            </div>
          </div>
        );

      case 'returns':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <header className="mb-16 text-center">
              <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-2xl mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-4">
                Our 7-Day <span className="text-orange-600">Tech Guarantee.</span>
              </h1>
              <p className="text-zinc-500 font-medium">Simple, fair, and transparent returns.</p>
            </header>

            <div className="space-y-2">
              <Accordion title="The 7-Day Window">
                <p>You have 7 calendar days from the date of delivery to initiate a return if your item is factory-defective or not as described on our platform.</p>
                <div className="bg-orange-50 p-6 rounded-2xl mt-4">
                  <h4 className="text-black font-black uppercase text-xs tracking-widest mb-4">Requirements</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-zinc-700">
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      Original packaging must be preserved.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-700">
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      All seals and tags must remain intact.
                    </li>
                  </ul>
                </div>
              </Accordion>

              <Accordion title="Activation Policy">
                <div className="bg-zinc-900 text-white p-8 rounded-[32px] my-4 shadow-xl">
                  {/* Fixed: Changed closing </li> to </h4> for tag consistency */}
                  <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Critical Activation Clause
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    "Change of mind" returns are strictly NOT accepted for opened software or laptops once the Operating System (Windows/macOS) has been activated. These items are considered "Used" once registered to a user account.
                  </p>
                </div>
              </Accordion>

              <Accordion title="Refund Methods">
                <p>We value your time. Refunds are processed quickly via your preferred digital channel.</p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex-1 p-4 bg-zinc-50 rounded-xl flex items-center gap-4">
                    <CreditCard className="text-orange-600" />
                    <div>
                      <p className="text-black font-bold text-sm">MoMo Transfer</p>
                      <p className="text-xs text-zinc-400">Within 3 working days</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-zinc-50 rounded-xl flex items-center gap-4">
                    <MapPin className="text-orange-600" />
                    <div>
                      <p className="text-black font-bold text-sm">Bank Transfer</p>
                      <p className="text-xs text-zinc-400">Within 3 working days</p>
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        );

      case 'warranty':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <header className="mb-16 text-center">
              <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-2xl mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic mb-4">
                Your Investment, <span className="text-orange-600">Protected.</span>
              </h1>
              <p className="text-zinc-500 font-medium">Comprehensive coverage from an authorized regional partner.</p>
            </header>

            <div className="space-y-2">
              <Accordion title="Standard 1-Year Coverage">
                <p>Every laptop purchased from Titan Electronics carries a minimum 1-Year Manufacturer Warranty. We handle the logistics so you don't have to.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {['Logic Board Failure', 'Screen Pixel Defects', 'Keyboard Malfunction', 'Battery Health (<80%)'].map(item => (
                    <div key={item} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-900">{item}</span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Warranty Exclusions">
                <p className="mb-4">The following scenarios void all warranty agreements:</p>
                <ul className="space-y-4">
                  {[
                    { title: 'Liquid Damage', desc: 'Any exposure to water, drinks, or moisture.' },
                    { title: 'Physical Impact', desc: 'Cracked screens or dents resulting from falls.' },
                    { title: 'Unauthorized Service', desc: 'Repairs attempted by third-party technicians.' }
                  ].map(ex => (
                    <li key={ex.title} className="flex gap-4">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                        <X className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-black font-bold text-sm">{ex.title}</h4>
                        <p className="text-xs text-zinc-500">{ex.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Accordion>

              <div className="mt-12 p-8 bg-zinc-950 rounded-[40px] text-center border border-zinc-800 shadow-2xl">
                <h3 className="text-xl font-black text-white uppercase italic mb-4">Need technical assistance?</h3>
                <p className="text-zinc-400 text-sm mb-8">Our engineers are standing by to verify your claim and initiate the repair process.</p>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-xs px-12 py-5 rounded-2xl transition-all shadow-xl shadow-orange-900/20 active:scale-95">
                  Submit a Warranty Claim
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-bold">Policy Not Found</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
    </div>
  );
};

export default Policies;
