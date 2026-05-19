import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const FacilitatorSettings: React.FC = () => {
    const { user } = useAuth();

    const [firstName, setFirstName] = useState<string>(user?.firstName || '');
    const [lastName, setLastName] = useState<string>(user?.lastName || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully! (Simulated local state update)');
        }, 800);
    };

    return (
        <>
            {/* Page Heading */}
            <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading mb-2">Instructor Profile & Settings</h1>
                <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal max-w-2xl">
                    Configure your institutional coordinate accounts, credentials, and preferences.
                </p>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden flex flex-col max-w-3xl">
                <div className="p-6 border-b border-slate-100 dark:border-[#323b67]/45 bg-slate-50/40 dark:bg-[#323b67]/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Personal Information</h2>
                    <p className="text-slate-400 dark:text-[#929bc9] text-xs">Verify your login coordinates and credentials inside Kepler College.</p>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">First Name</label>
                            <input 
                                required
                                className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60" 
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Last Name</label>
                            <input 
                                required
                                className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60" 
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Email Address</label>
                            <input 
                                required
                                className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Platform Role</label>
                            <input 
                                disabled
                                className="w-full rounded-xl bg-slate-100 dark:bg-[#323b67]/40 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-[#929bc9] py-3 px-4 text-sm font-bold outline-none cursor-not-allowed uppercase tracking-wider" 
                                type="text" 
                                value={user?.role || 'FACILITATOR'} 
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#323b67]/10 border-t border-slate-100 dark:border-[#323b67]/45 flex justify-end gap-3">
                    <button 
                        disabled={isSaving}
                        type="submit" 
                        className="px-6 py-3 rounded-xl bg-primary text-[#111422] font-black hover:bg-emerald-600 hover-scale active-scale transition-all shadow-md shadow-primary/10 font-heading text-xs"
                    >
                        {isSaving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorSettings;
