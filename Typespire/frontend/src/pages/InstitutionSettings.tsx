import React, { useState, useEffect } from 'react';
import { Palette, Zap, CloudUpload, Plus, Building2, School, ArrowRight, Info, BadgeCheck, Eye, TrendingUp, Check, Star, Lightbulb, Sliders } from 'lucide-react';

import { useInstitution } from '../context/InstitutionContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { PRACTICE_STAGES } from '../data/practiceModules';

const InstitutionSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'branding' | 'benchmarks'>('branding');
    const { settings, updateSettings } = useInstitution();
    const { user } = useAuth();
    const [stageRequirements, setStageRequirements] = useState<Record<string, { wpm: number; accuracy: number }>>({});
    const [savingStageId, setSavingStageId] = useState<string | null>(null);
    const [selectedModuleNum, setSelectedModuleNum] = useState<number>(1);

    useEffect(() => {
        if (activeTab === 'benchmarks' && user?.institutionId) {
            api.get(`/requirements/institution/${user.institutionId}`)
                .then(res => {
                    const reqs: Record<string, { wpm: number; accuracy: number }> = {};
                    res.data.forEach((r: any) => {
                        reqs[r.stageId] = { wpm: r.wpm, accuracy: r.accuracy };
                    });
                    
                    // Pre-fill missing with defaults from PRACTICE_STAGES
                    const initial: Record<string, { wpm: number; accuracy: number }> = {};
                    PRACTICE_STAGES.forEach(stage => {
                        initial[stage.id] = reqs[stage.id] || { 
                            wpm: stage.defaultWpm || 20, 
                            accuracy: stage.defaultAccuracy || 90 
                        };
                    });
                    setStageRequirements(initial);
                })
                .catch(err => {
                    console.error("Failed to load institution stage requirements", err);
                    const initial: Record<string, { wpm: number; accuracy: number }> = {};
                    PRACTICE_STAGES.forEach(stage => {
                        initial[stage.id] = { 
                            wpm: stage.defaultWpm || 20, 
                            accuracy: stage.defaultAccuracy || 90 
                        };
                    });
                    setStageRequirements(initial);
                });
        }
    }, [activeTab, user?.institutionId]);

    const handleStageChange = (stageId: string, field: 'wpm' | 'accuracy', value: number) => {
        setStageRequirements(prev => ({
            ...prev,
            [stageId]: {
                ...prev[stageId],
                [field]: value
            }
        }));
    };

    const handleSaveStage = async (stageId: string) => {
        if (!user?.institutionId) return;
        setSavingStageId(stageId);
        try {
            await api.post(`/requirements/institution/${user.institutionId}`, {
                stageId,
                wpm: stageRequirements[stageId].wpm,
                accuracy: stageRequirements[stageId].accuracy
            });
            alert(`Curriculum requirements for Stage ${stageRequirements[stageId].wpm} saved successfully!`);
        } catch (err) {
            console.error("Failed to save curriculum stage requirements:", err);
            alert("Failed to save stage requirements. Please try again.");
        } finally {
            setSavingStageId(null);
        }
    };

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 lg:px-10">
            {/* Page Heading */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Institution Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">Manage your institution's branding, identity, and academic proficiency benchmarks.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border-light dark:border-white/10 mb-8">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`flex items-center gap-2 border-b-[3px] pb-3 px-2 transition-all ${activeTab === 'branding' ? 'border-admin-primary text-secondary-navy dark:text-white' : 'border-transparent text-secondary-navy/50 dark:text-white/50 hover:text-secondary-navy dark:hover:text-white'}`}
                    >
                        <Palette className="w-5 h-5" />
                        <span className="text-sm font-bold leading-normal tracking-[0.015em]">Branding & Identity</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('benchmarks')}
                        className={`flex items-center gap-2 border-b-[3px] pb-3 px-2 transition-all ${activeTab === 'benchmarks' ? 'border-admin-primary text-secondary-navy dark:text-white' : 'border-transparent text-secondary-navy/50 dark:text-white/50 hover:text-secondary-navy dark:hover:text-white'}`}
                    >
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-bold leading-normal tracking-[0.015em]">Proficiency Benchmarks</span>
                    </button>
                </div>
            </div>

            {activeTab === 'branding' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Settings Forms (8 cols) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
                        {/* Section: Visual Identity */}
                        <section className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-admin-primary/10 text-admin-primary">
                                    <Palette className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visual Identity</h2>
                            </div>
                            <div className="flex flex-col gap-8">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">School Logo</label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors py-10 px-6 text-center group cursor-pointer">
                                        <div className="size-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <CloudUpload className="text-admin-primary w-8 h-8" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-medium">Click to upload or drag and drop</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">SVG, PNG or JPG (max. 2MB)</p>
                                    </div>
                                </div>
                                {/* Accent Color */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Primary Accent Color</label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose a color that matches your school uniforms or branding. This will be used for buttons and highlights.</p>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        {/* Color Input Wrapper */}
                                        <div className="flex items-center gap-2 p-1 pl-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-admin-primary focus-within:border-transparent">
                                            <span className="text-slate-500 font-mono">#</span>
                                            <input className="w-20 border-none bg-transparent p-0 text-slate-900 dark:text-white font-mono focus:ring-0 uppercase" maxLength={6} type="text" defaultValue="3B82F6" />
                                            <div className="size-8 rounded bg-[#3B82F6] shadow-inner border border-black/10"></div>
                                        </div>
                                        {/* Predefined Palette */}
                                        <div className="flex gap-2">
                                            <button aria-label="Select Navy Blue" className="size-8 rounded-full bg-[#1e40af] ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-850 ring-[#1e40af] hover:scale-110 transition-transform"></button>
                                            <button aria-label="Select Red" className="size-8 rounded-full bg-[#b91c1c] hover:scale-110 transition-transform border border-transparent hover:border-slate-300"></button>
                                            <button aria-label="Select Green" className="size-8 rounded-full bg-[#047857] hover:scale-110 transition-transform border border-transparent hover:border-slate-300"></button>
                                            <button aria-label="Select Purple" className="size-8 rounded-full bg-[#7e22ce] hover:scale-110 transition-transform border border-transparent hover:border-slate-300"></button>
                                            <button aria-label="Custom Color" className="size-8 rounded-full bg-white border border-slate-300 hover:scale-110 transition-transform flex items-center justify-center group">
                                                <Plus className="text-slate-400 w-4 h-4 group-hover:text-admin-primary" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Section: Institution Details */}
                        <section className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-admin-primary/10 text-admin-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Institution Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="schoolName">Institution Name</label>
                                    <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary shadow-sm" id="schoolName" placeholder="e.g. Springfield High" type="text" defaultValue="Springfield High School" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="website">Website URL</label>
                                    <div className="flex shadow-sm rounded-lg">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 text-sm">https://</span>
                                        <input className="flex-1 block w-full rounded-none rounded-r-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary sm:text-sm" id="website" placeholder="www.springfield.edu" type="text" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="supportEmail">Support Email</label>
                                    <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary shadow-sm" id="supportEmail" placeholder="support@springfield.edu" type="email" />
                                    <p className="mt-1 text-xs text-slate-500">Used for password reset inquiries.</p>
                                </div>
                            </div>
                        </section>
                        {/* Action Bar */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Reset to Defaults
                            </button>
                            <button className="px-8 py-2.5 rounded-lg bg-admin-primary text-slate-900 font-bold hover:bg-admin-primary/90 shadow-lg shadow-admin-primary/20 transition-all transform hover:-translate-y-0.5">
                                Save Changes
                            </button>
                        </div>
                    </div>
                    {/* Right Column: Live Preview (4 cols) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-28 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Preview</h3>
                                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Student View</span>
                            </div>
                            {/* Preview Card Component */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-lg">
                                {/* Mock Browser Bar */}
                                <div className="bg-slate-200 dark:bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-300 dark:border-slate-700">
                                    <div className="flex gap-1.5">
                                        <div className="size-2.5 rounded-full bg-red-400"></div>
                                        <div className="size-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="size-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="mx-auto text-[10px] text-slate-500 font-mono bg-white dark:bg-slate-900 px-3 py-0.5 rounded-full opacity-60 w-32 text-center truncate">typespire.com/login</div>
                                </div>
                                {/* Mock Login Screen Content */}
                                <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-background-dark relative">
                                    {/* Background decorations */}
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                    <div className="w-full max-w-[280px] z-10">
                                        {/* Logo Place */}
                                        <div className="flex justify-center mb-8">
                                            <div className="size-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                <School className="text-[#3B82F6] w-10 h-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1 text-center mb-6">
                                                <h4 className="text-slate-900 dark:text-white font-bold text-lg">Springfield High School</h4>
                                                <p className="text-xs text-slate-500">Sign in to your account</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-9 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 flex items-center text-xs text-slate-400">
                                                    student@id...
                                                </div>
                                                <div className="h-9 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 flex items-center text-xs text-slate-400">
                                                    ••••••••
                                                </div>
                                            </div>
                                            <button className="w-full h-9 rounded text-xs font-bold text-white shadow-md mt-2 flex items-center justify-center gap-2" style={{ backgroundColor: "#3B82F6" }}>
                                                Sign In
                                                <ArrowRight className="w-[14px] h-[14px]" />
                                            </button>
                                            <div className="text-center mt-4">
                                                <span className="text-[10px] text-slate-400 hover:text-admin-primary cursor-pointer">Forgot password?</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 text-[10px] text-slate-300 dark:text-slate-600">
                                        Powered by <span className="font-bold">Typespire</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-3 flex gap-3">
                                <Info className="text-blue-600 dark:text-blue-400 w-4 h-4 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                    Changes to branding may take up to 5 minutes to propagate to all student devices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                    {/* Left Column: Configuration Form (Span 7) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-border-light dark:border-white/10 p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-light dark:border-white/10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Benchmark Configuration</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Define speed and accuracy requirements.</p>
                                </div>
                                {/* Toggle Switch */}
                                <label className="inline-flex items-center cursor-pointer group">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 dark:peer-focus:ring-admin-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-admin-primary transition-colors">Custom Enabled</span>
                                </label>
                            </div>
                            <div className="space-y-8">
                                {/* Level 1 Input */}
                                <div className="group">
                                    <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white flex items-center justify-between" htmlFor="level1">
                                        <span>Level 1: Basic Proficiency</span>
                                        <span className="text-xs text-slate-400 font-normal">System Default: 30 WPM</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <Zap className="text-slate-400 w-5 h-5" />
                                        </div>
                                        <input 
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-admin-primary focus:border-admin-primary block w-full ps-10 p-2.5 font-display font-semibold" 
                                            id="level1" 
                                            placeholder="30" 
                                            type="number" 
                                            value={settings.level1Wpm}
                                            onChange={(e) => updateSettings({ level1Wpm: parseInt(e.target.value) || 0 })}
                                        />
                                        <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                                            <span className="text-sm text-slate-500 font-medium">WPM</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Minimum speed required to pass the beginner curriculum.</p>
                                </div>
                                {/* Level 2 Input */}
                                <div className="group">
                                    <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white flex items-center justify-between" htmlFor="level2">
                                        <span className="flex items-center gap-2">
                                            Level 2: Advanced Mastery
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">Target Goal</span>
                                        </span>
                                        <span className="text-xs text-slate-400 font-normal">System Default: 50 WPM</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <BadgeCheck className="text-emerald-600 dark:text-emerald-500 w-5 h-5" />
                                        </div>
                                        <input 
                                            className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5 font-display font-semibold shadow-sm" 
                                            id="level2" 
                                            placeholder="50" 
                                            type="number" 
                                            value={settings.level2Wpm}
                                            onChange={(e) => updateSettings({ level2Wpm: parseInt(e.target.value) || 0 })}
                                        />
                                        <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                                            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">WPM</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Target speed for students to achieve full certification.</p>
                                </div>
                                {/* Accuracy Slider */}
                                <div className="pt-4 border-t border-border-light dark:border-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="accuracy">Required Accuracy</label>
                                        <span className="text-sm font-bold text-admin-primary dark:text-white bg-blue-50 dark:bg-admin-primary/20 px-2 py-1 rounded">{settings.requiredAccuracy}%</span>
                                    </div>
                                    <input 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-admin-primary" 
                                        id="accuracy" 
                                        max="100" 
                                        min="80" 
                                        type="range" 
                                        value={settings.requiredAccuracy}
                                        onChange={(e) => updateSettings({ requiredAccuracy: parseInt(e.target.value) })}
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>80% (Lenient)</span>
                                        <span>100% (Strict)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button className="text-sm text-slate-500 hover:text-red-600 font-medium underline decoration-slate-300 hover:decoration-red-300 underline-offset-4 transition-all">
                                    Reset to Defaults
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Live Preview (Span 5) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-4">
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <Eye className="text-slate-400 w-5 h-5" />
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Student Dashboard Preview</h3>
                            </div>
                            {/* Card Mockup */}
                            <div className="bg-white dark:bg-white/5 rounded-xl shadow-lg border border-border-light dark:border-white/10 overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800">
                                {/* Mockup Header */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Current Progress</span>
                                    <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm">Fall Semester</span>
                                </div>
                                {/* Mockup Body */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">45 <span className="text-lg font-medium text-slate-500">WPM</span></span>
                                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-sm font-medium">
                                            <TrendingUp className="w-4 h-4" />
                                            +5 this week
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6">Current Typing Speed</p>
                                    {/* Visual Gauge/Bar */}
                                    <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-8">
                                        {/* Progress Fill */}
                                        <div className="absolute top-0 left-0 h-full bg-admin-primary rounded-full" style={{ width: "75%" }}></div>
                                        {/* Level 1 Marker */}
                                        <div className="absolute top-0 flex flex-col items-center -ml-3" style={{ left: "58%" }}>
                                            <div className="h-4 w-1 bg-white/50 z-10"></div> {/* Tick mark inside bar */}
                                            <div className="mt-2 flex flex-col items-center">
                                                <div className="h-6 w-6 rounded-full bg-admin-primary text-white flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-md z-20">
                                                    <Check className="w-[14px] h-[14px]" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wide">Lvl 1</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{settings.level1Wpm}</span>
                                            </div>
                                        </div>
                                        {/* Level 2 Marker */}
                                        <div className="absolute top-0 flex flex-col items-center -ml-3" style={{ left: "100%" }}>
                                            <div className="mt-2 flex flex-col items-center">
                                                <div className="h-6 w-6 rounded-full bg-white dark:bg-slate-700 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center shadow-md z-20">
                                                    <Star className="w-[14px] h-[14px]" />
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wide">Goal</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{settings.level2Wpm}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dynamic Text Feedback */}
                                    <div className="bg-blue-50 dark:bg-admin-primary/10 rounded-lg p-4 mt-8 flex gap-3">
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 shadow-sm text-admin-primary">
                                            <Lightbulb className="w-[18px] h-[18px]" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-slate-800 dark:text-white mb-1">Keep pushing!</p>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                You've passed the <span className="font-semibold text-slate-900 dark:text-white">Level 1</span> benchmark ({settings.level1Wpm} WPM). You are <span className="font-bold text-admin-primary">{Math.max(0, settings.level2Wpm - 45)} WPM</span> away from Master Status.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Helper Text */}
                            <p className="text-xs text-center text-slate-400 px-4">
                                This preview updates in real-time as you adjust the values on the left.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section: Curriculum Stage Benchmarks */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-admin-primary/10 text-admin-primary">
                            <Sliders className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curriculum Stage Benchmarks</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure passing speed and accuracy targets for each individual learning stage. Saves instantly across all sections.</p>
                        </div>
                    </div>

                    {/* Module Tabs Selector */}
                    <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-50 dark:bg-[#1a1f36]/40 rounded-xl border border-slate-100 dark:border-[#323b67]/20 w-fit">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => setSelectedModuleNum(num)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    selectedModuleNum === num
                                        ? 'bg-admin-primary text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {num === 9 ? 'Capstone Test' : `Module ${num}`}
                            </button>
                        ))}
                    </div>

                    {/* Curriculum Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PRACTICE_STAGES.filter(stage => {
                            if (selectedModuleNum === 9) {
                                return stage.id === 'stage-capstone';
                            }
                            return stage.id.includes(`-${selectedModuleNum}-`) || stage.id === `stage-${selectedModuleNum}-shift`;
                        }).map(stage => {
                            const req = stageRequirements[stage.id] || { 
                                wpm: stage.defaultWpm || 20, 
                                accuracy: stage.defaultAccuracy || 90 
                            };
                            const isSaving = savingStageId === stage.id;
                            
                            return (
                                <div key={stage.id} className="flex flex-col justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-[#323b67] bg-slate-50/30 dark:bg-[#232948]/20 hover:border-admin-primary/45 transition-colors">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Stage {stage.stageNumber}: {stage.title}</h4>
                                            <span className="px-2 py-0.5 rounded-full bg-admin-primary/10 text-admin-primary font-bold text-[10px] uppercase">
                                                {stage.type || 'Practice'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-[#929bc9] leading-relaxed line-clamp-2 italic mb-2">
                                            "{stage.practiceText}"
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-between pt-3 border-t border-slate-100 dark:border-[#323b67]/30">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Target WPM</label>
                                                <input 
                                                    type="number" 
                                                    value={req.wpm}
                                                    onChange={(e) => handleStageChange(stage.id, 'wpm', Number(e.target.value))}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-bold font-mono text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-admin-primary focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Target Acc %</label>
                                                <input 
                                                    type="number" 
                                                    value={req.accuracy}
                                                    onChange={(e) => handleStageChange(stage.id, 'accuracy', Number(e.target.value))}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-[#1a1f36] border border-slate-300 dark:border-[#323b67] text-sm font-bold font-mono text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-admin-primary focus:border-transparent outline-none"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            disabled={isSaving}
                                            onClick={() => handleSaveStage(stage.id)}
                                            className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
                                                isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-admin-primary hover:bg-admin-primary-hover shadow-sm'
                                            }`}
                                        >
                                            {isSaving ? (
                                                'Saving...'
                                            ) : (
                                                <>
                                                    <Check className="w-3.5 h-3.5" /> Save Stage
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default InstitutionSettings;
