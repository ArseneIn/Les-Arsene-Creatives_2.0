
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, LogOut, CheckCircle2, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

interface ProfileSettingsProps {
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    weeklySummary: false,
  });

  const handleVerifyNumber = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('Verification WhatsApp message sent to +250 78x xxx xxx. Terminal link confirmed.');
    }, 1500);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-black uppercase italic leading-none">
          Admin <span className="text-orange-600">Profile</span>
        </h2>
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your administrative credentials and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Personal Info */}
        <section className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-50">
            <User className="text-orange-600 w-5 h-5" />
            <h3 className="text-lg font-black text-black uppercase italic">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 w-4 h-4" />
                <input 
                  disabled
                  value="Arsene Cyuzuzo"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-black font-bold outline-none opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Professional Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 w-4 h-4" />
                <input 
                  disabled
                  value="arsene.admin@titanelectronics.rw"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-black font-bold outline-none opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">WhatsApp Business Number</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 w-4 h-4" />
                  <input 
                    defaultValue="+250 78x xxx xxx"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-black font-bold outline-none focus:border-orange-600 transition-all"
                  />
                </div>
                <button 
                  onClick={handleVerifyNumber}
                  disabled={isVerifying}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl shadow-lg shadow-orange-900/10 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isVerifying ? 'Sending...' : <><MessageSquare className="w-4 h-4" /> Verify Number</>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Security */}
        <section className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-50">
            <Lock className="text-orange-600 w-5 h-5" />
            <h3 className="text-lg font-black text-black uppercase italic">Security & Credentials</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Current Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-black font-bold outline-none focus:border-orange-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-black font-bold outline-none focus:border-orange-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-black font-bold outline-none focus:border-orange-600"
              />
            </div>
          </div>
          
          <button className="w-full bg-black text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
            <ShieldCheck className="w-5 h-5 text-orange-600" /> Update Access Credentials
          </button>
        </section>

        {/* Section 3: Notification Preferences */}
        <section className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-50">
            <Bell className="text-orange-600 w-5 h-5" />
            <h3 className="text-lg font-black text-black uppercase italic">System Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'newOrder', label: 'Notify me on New Order', desc: 'Real-time WhatsApp alerts for every checkout.', icon: Zap },
              { id: 'lowStock', label: 'Notify me on Low Stock (<3 units)', desc: 'Automatic flags for critical inventory levels.', icon: CheckCircle2 },
              { id: 'weeklySummary', label: 'Weekly Sales Summary', desc: 'Financial breakdown sent every Monday at 8:00 AM.', icon: ShieldCheck },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                    <pref.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">{pref.label}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{pref.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification(pref.id as any)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${notifications[pref.id as keyof typeof notifications] ? 'bg-orange-600' : 'bg-zinc-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications[pref.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Logout Action */}
        <div className="pt-8">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-6 bg-red-50 text-red-600 rounded-[32px] border border-red-100 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-900/5 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> End Administrative Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
