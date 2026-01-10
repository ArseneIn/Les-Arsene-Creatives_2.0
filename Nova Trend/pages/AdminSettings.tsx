import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Lock, Bell, LogOut, 
  CheckCircle2, MessageSquare, ShieldCheck, 
  Zap, Loader2, AlertCircle, Save, Users,
  Shield, Key, LayoutDashboard, Package,
  Smartphone, Trash2, Plus, Power,
  Sparkles, Clock, Globe, Database,
  Settings, Activity, RefreshCw
} from 'lucide-react';
import { supabase, getInternalStaff, updateInternalPermission, deployNewAdmin } from '../lib/api';
import { AdminRole, InternalPermissions } from '../types';

interface AdminSettingsProps {
  onLogout: () => void;
  isSuperAdmin: boolean;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onLogout, isSuperAdmin }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'automation' | 'staff'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  // Profile State
  const [fullName, setFullName] = useState('Arsene Cyuzuzo');
  const [email, setEmail] = useState('arsene.admin@titanelectronics.rw');
  
  // Engine States
  const [engines, setEngines] = useState({
    autoSpec: true,
    narrativeAi: true,
    p1Hours: 4,
    p2Hours: 12,
    p3Hours: 24,
    waTriggers: true,
    waKey: '••••••••••••••••',
    baseCurrency: 'USD',
    syncInterval: 6
  });

  // Internal Staff Matrix State
  const [staffNodes, setStaffNodes] = useState<any[]>([]);
  const [isDeployingAdmin, setIsDeployingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role_type: 'sales_associate' });

  useEffect(() => {
    if (activeTab === 'staff' && isSuperAdmin) {
      const loadStaff = async () => {
        setIsLoading(true);
        try {
          const data = await getInternalStaff();
          setStaffNodes(data);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
      };
      loadStaff();
    }
  }, [activeTab, isSuperAdmin]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTogglePermission = async (staffId: string, flag: keyof InternalPermissions) => {
    const target = staffNodes.find(s => s.id === staffId);
    if (!target) return;

    const newValue = !target[flag];
    try {
      await updateInternalPermission(staffId, flag, newValue);
      setStaffNodes(prev => prev.map(s => s.id === staffId ? { ...s, [flag]: newValue } : s));
      showToast(`${flag.replace('perm_', '').toUpperCase()} registry synced.`);
    } catch (err) {
      showToast("Handshake failed. Registry stable.", "error");
    }
  };

  const handleDeployAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await deployNewAdmin({
        ...newAdmin,
        perm_financials: false, 
        perm_fleet: true, 
        perm_support: false, 
        perm_userdata: true 
      });
      setStaffNodes([result, ...staffNodes]);
      setIsDeployingAdmin(false);
      setNewAdmin({ name: '', email: '', password: '', role_type: 'sales_associate' });
      showToast("New Admin Node Deployed successfully.");
    } catch (err) {
      showToast("Deployment protocol failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-orange-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const sectionClasses = "bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors";

  const EngineCard = ({ title, icon: Icon, description, children }: { title: string, icon: any, description: string, children?: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 flex flex-col h-full shadow-sm hover:border-nova-orange/20 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-950 dark:bg-black rounded-2xl flex items-center justify-center text-nova-orange shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{description}</p>
        </div>
      </div>
      <div className="flex-1 space-y-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic leading-none tracking-tighter">
            System <span className="text-orange-600">Preferences</span>
          </h2>
          <p className="text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">Node Control & Administrative Security v5.0</p>
        </div>
        
        <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
           {[
             { id: 'profile', label: 'IDENTITY', icon: User },
             { id: 'automation', label: 'ENGINES', icon: Zap },
             { id: 'staff', label: 'INTERNAL NODES', icon: Shield, adminOnly: true }
           ].filter(t => !t.adminOnly || isSuperAdmin).map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
             >
               <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <section className={sectionClasses}>
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-zinc-50 dark:border-slate-800">
                <User className="text-orange-600 w-5 h-5" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Identity Management</h3>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fixed: Completed the truncated profile fields */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={inputClasses}
                        placeholder="Arsene Cyuzuzo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Professional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClasses}
                        placeholder="arsene.admin@titanelectronics.rw"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => showToast("Profile identity updated successfully.")}
                  className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                >
                  <Save className="w-5 h-5 text-orange-600" /> Commit Identity Changes
                </button>
              </form>
            </section>

            <section className={sectionClasses}>
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-zinc-50 dark:border-slate-800">
                <Lock className="text-orange-600 w-5 h-5" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Security Shield</h3>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-nova-orange shadow-sm">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Password Protocol</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Last changed: 14 days ago</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-nova-orange hover:text-white transition-all">Update Key</button>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-slate-950 dark:bg-black p-10 rounded-[40px] text-white shadow-2xl space-y-8 relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="text-xl font-black uppercase italic leading-none mb-2">Registry <span className="text-nova-orange">Status</span></h3>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10">Node: Kigali-Master-01</p>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</span>
                       <span className="text-xs font-black text-emerald-500">99.98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</span>
                       <span className="text-xs font-black text-white">24ms</span>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-nova-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <button 
              onClick={onLogout}
              className="w-full py-6 bg-red-950/20 border border-red-900/30 text-red-500 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-900/40 transition-all"
            >
              <LogOut className="w-4 h-4" /> Terminate Node Session
            </button>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EngineCard 
            title="Auto-Spec Matrix" 
            icon={Sparkles} 
            description="AI-driven technical parameter discovery"
          >
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
               <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Engine State</span>
               <button 
                onClick={() => setEngines(prev => ({...prev, autoSpec: !prev.autoSpec}))}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${engines.autoSpec ? 'bg-nova-orange' : 'bg-slate-300 dark:bg-slate-700'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${engines.autoSpec ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">Uses Gemini-3-Flash for automated technical benchmarking.</p>
          </EngineCard>

          <EngineCard 
            title="SLA Registry" 
            icon={Clock} 
            description="Service Level Agreement Timing"
          >
            <div className="space-y-4">
               {['P1', 'P2', 'P3'].map((p) => (
                 <div key={p} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{p} Response</span>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={engines[`${p.toLowerCase()}Hours` as keyof typeof engines]} 
                        onChange={(e) => setEngines(prev => ({...prev, [`${p.toLowerCase()}Hours`]: parseInt(e.target.value)}))}
                        className="w-16 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center text-xs font-black text-nova-orange"
                      />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Hrs</span>
                    </div>
                 </div>
               ))}
            </div>
          </EngineCard>

          <EngineCard 
            title="WhatsApp Hub" 
            icon={MessageSquare} 
            description="Direct Gateway Integrations"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Triggers</span>
                <button 
                  onClick={() => setEngines(prev => ({...prev, waTriggers: !prev.waTriggers}))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${engines.waTriggers ? 'bg-nova-orange' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${engines.waTriggers ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <input 
                type="password"
                value={engines.waKey}
                onChange={(e) => setEngines(prev => ({...prev, waKey: e.target.value}))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs font-bold text-slate-400"
                placeholder="API Access Key..."
              />
            </div>
          </EngineCard>
        </div>
      )}

      {activeTab === 'staff' && isSuperAdmin && (
        <div className="space-y-8">
           <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Internal Staff Nodes</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage administrative hierarchy and permissions</p>
              </div>
              <button 
                onClick={() => setIsDeployingAdmin(true)}
                className="bg-nova-orange hover:bg-nova-hover text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-xl active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" /> Deploy New Node
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staffNodes.map((staff) => (
                <div key={staff.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all group hover:border-nova-orange/30">
                   <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-950 dark:bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <User className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{staff.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.role_type.replace('_', ' ')}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      {[
                        { flag: 'perm_financials', label: 'Financials' },
                        { flag: 'perm_fleet', label: 'Fleet Ops' },
                        { flag: 'perm_support', label: 'Support' },
                        { flag: 'perm_userdata', label: 'User Data' }
                      ].map((p) => (
                        <button 
                          key={p.flag}
                          onClick={() => handleTogglePermission(staff.id, p.flag as any)}
                          className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${staff[p.flag] ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-slate-950' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'}`}
                        >
                          {p.label}
                          {staff[p.flag] ? <CheckCircle2 className="w-3 h-3 text-nova-orange" /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-700" />}
                        </button>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Deployment Modal */}
      {isDeployingAdmin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeployingAdmin(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-white/5">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-8">Deploy <span className="text-nova-orange">Internal Node</span></h3>
            <form onSubmit={handleDeployAdmin} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Identity Name</label>
                 <input 
                  required
                  value={newAdmin.name} 
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-nova-orange"
                  placeholder="Arsene Cyuzuzo"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Node Email</label>
                 <input 
                  required
                  type="email"
                  value={newAdmin.email} 
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-nova-orange"
                  placeholder="user@novatrend.rw"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Asset Role</label>
                 <select 
                   value={newAdmin.role_type}
                   onChange={(e) => setNewAdmin({...newAdmin, role_type: e.target.value as any})}
                   className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-nova-orange"
                 >
                   <option value="sales_associate">Sales Associate</option>
                   <option value="inventory_manager">Inventory Manager</option>
                   <option value="support_lead">Support Lead</option>
                 </select>
               </div>
               <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsDeployingAdmin(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Abort</button>
                  <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-nova-orange text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-3">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Node'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-10 right-10 z-[300] px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 ${toast.type === 'success' ? 'bg-black text-white border border-nova-orange/30' : 'bg-red-950 text-red-400 border border-red-500/30'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="text-nova-orange w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;