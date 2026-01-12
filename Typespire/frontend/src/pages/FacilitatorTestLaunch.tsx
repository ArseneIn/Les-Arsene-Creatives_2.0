import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFacilitator } from '../context/FacilitatorContext';

const FacilitatorTestLaunch: React.FC = () => {
    const navigate = useNavigate();
    const { publishAssignment } = useFacilitator();

    const [selectedText, setSelectedText] = useState('The Velveteen Rabbit');
    const [targetSection, setTargetSection] = useState('');
    const [timeLimit, setTimeLimit] = useState('1');
    const [allowedTrials, setAllowedTrials] = useState('');

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetSection) {
            alert('Please select a target section.');
            return;
        }

        publishAssignment({
            title: selectedText,
            sectionId: targetSection,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Due in 1 week
        });

        navigate('/facilitator');
    };

    return (
        <div className="w-full flex justify-center py-6 px-4 md:px-10 lg:px-20">
            <div className="w-full max-w-[1280px] flex flex-col gap-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 px-0 md:px-4">
                    <Link to="/facilitator" className="text-text-secondary hover:text-facilitator-primary text-sm font-medium leading-normal transition-colors">Dashboard</Link>
                    <span className="text-text-secondary text-sm font-medium leading-normal">/</span>
                    <span className="text-kepler-navy dark:text-white text-sm font-medium leading-normal">New Session</span>
                </div>

                {/* Page Heading */}
                <div className="flex flex-wrap justify-between gap-3 px-0 md:px-4">
                    <div className="flex min-w-72 flex-col gap-2">
                        <h1 className="text-kepler-navy dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Configure Test Session</h1>
                        <p className="text-text-secondary text-base font-normal leading-normal">Select content and parameters for your students.</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-0 md:px-4">
                    {/* LEFT COLUMN: Content Selection */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="border-b border-surface-light dark:border-white/10">
                            <div className="flex gap-8">
                                <a className="flex flex-col items-center justify-center border-b-[3px] border-facilitator-primary text-kepler-navy dark:text-white pb-3 px-2 cursor-pointer transition-all hover:bg-surface-light/50 rounded-t" href="#">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">library_books</span>
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Text Library</p>
                                    </div>
                                </a>
                                <a className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-text-secondary hover:text-kepler-navy dark:hover:text-white pb-3 px-2 cursor-pointer transition-all hover:bg-surface-light/50 rounded-t" href="#">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">edit_note</span>
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Custom Text</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col gap-2">
                            <label className="flex flex-col h-12 w-full">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full group focus-within:ring-2 focus-within:ring-facilitator-primary/50 transition-all">
                                    <div className="text-text-secondary flex border-none bg-surface-light dark:bg-white/5 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none text-kepler-navy dark:text-white focus:outline-0 border-none bg-surface-light dark:bg-white/5 h-full placeholder:text-text-secondary px-4 pl-2 text-base font-normal leading-normal" placeholder="Search library texts by title, author, or keywords..." />
                                </div>
                            </label>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider px-2">Filters:</span>
                                <span className="text-xs bg-surface-light dark:bg-white/5 text-kepler-navy dark:text-white px-2 py-0.5 rounded cursor-pointer hover:bg-facilitator-primary/20">Fiction</span>
                                <span className="text-xs bg-surface-light dark:bg-white/5 text-kepler-navy dark:text-white px-2 py-0.5 rounded cursor-pointer hover:bg-facilitator-primary/20">Science</span>
                                <span className="text-xs bg-surface-light dark:bg-white/5 text-kepler-navy dark:text-white px-2 py-0.5 rounded cursor-pointer hover:bg-facilitator-primary/20">History</span>
                            </div>
                        </div>

                        {/* Library Content List */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Recommended Texts</p>
                            {/* Card 1 (Selected) */}
                            <div
                                onClick={() => setSelectedText('The Velveteen Rabbit')}
                                className={`relative group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border-2 ${selectedText === 'The Velveteen Rabbit' ? 'border-facilitator-primary' : 'border-surface-light dark:border-white/10'} bg-white dark:bg-white/5 hover:shadow-md transition-shadow cursor-pointer`}
                            >
                                {selectedText === 'The Velveteen Rabbit' && (
                                    <div className="absolute top-4 right-4">
                                        <div className="size-6 rounded-full bg-facilitator-primary flex items-center justify-center text-kepler-navy">
                                            <span className="material-symbols-outlined text-base font-bold">check</span>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="size-16 min-w-[64px] rounded-lg bg-surface-light bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J')" }}
                                ></div>
                                <div className="flex flex-col gap-1 flex-1 pr-8">
                                    <h3 className="text-kepler-navy dark:text-white font-bold text-lg">The Velveteen Rabbit</h3>
                                    <p className="text-text-secondary text-sm">by Margery Williams</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Easy</span>
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span> 2 min
                                        </span>
                                        <span className="text-xs text-text-secondary">182 words</span>
                                    </div>
                                    <p className="text-kepler-navy/70 dark:text-white/70 text-sm mt-3 line-clamp-2">"What is REAL?" asked the Rabbit one day, when they were lying side by side near the nursery fender...</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div
                                onClick={() => setSelectedText('The Scale of the Universe')}
                                className={`relative group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border-2 ${selectedText === 'The Scale of the Universe' ? 'border-facilitator-primary' : 'border-surface-light dark:border-white/10'} bg-white dark:bg-white/5 hover:shadow-md transition-shadow cursor-pointer`}
                            >
                                {selectedText === 'The Scale of the Universe' && (
                                    <div className="absolute top-4 right-4">
                                        <div className="size-6 rounded-full bg-facilitator-primary flex items-center justify-center text-kepler-navy">
                                            <span className="material-symbols-outlined text-base font-bold">check</span>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="size-16 min-w-[64px] rounded-lg bg-surface-light bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8-rmXu2ZtPul-xNuKjMxc7Q0pTR2COZUn8EQ6Pn22RALtntDwVBzHOkuS3FEDpjuEUqqZFi6r3scVmZJnx6II9ti_Nx6IRPO-FM7QmuiDkn_jWbiAbeXXiwyRApBiGIpG3xS7niw8MGsrKLbk5CkIGdBdG8FGzuY8Ls6OqAgk_G4iCmLU2T1JT50_LpmyvlhEmTkeCor3mGYalKar9ACq_2Q2jzZTXJx0VB4rUSWAEMb9aq6iDhGBudg0AbN8c7eVi4RhxmX4hiFv')" }}
                                ></div>
                                <div className="flex flex-col gap-1 flex-1 pr-8">
                                    <h3 className="text-kepler-navy dark:text-white font-bold text-lg">The Scale of the Universe</h3>
                                    <p className="text-text-secondary text-sm">by NASA Science</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">Medium</span>
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span> 3 min
                                        </span>
                                        <span className="text-xs text-text-secondary">345 words</span>
                                    </div>
                                    <p className="text-kepler-navy/70 dark:text-white/70 text-sm mt-3 line-clamp-2">The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck...</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div
                                onClick={() => setSelectedText('Introduction to Python')}
                                className={`relative group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border-2 ${selectedText === 'Introduction to Python' ? 'border-facilitator-primary' : 'border-surface-light dark:border-white/10'} bg-white dark:bg-white/5 hover:shadow-md transition-shadow cursor-pointer`}
                            >
                                {selectedText === 'Introduction to Python' && (
                                    <div className="absolute top-4 right-4">
                                        <div className="size-6 rounded-full bg-facilitator-primary flex items-center justify-center text-kepler-navy">
                                            <span className="material-symbols-outlined text-base font-bold">check</span>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="size-16 min-w-[64px] rounded-lg bg-surface-light bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk')" }}
                                ></div>
                                <div className="flex flex-col gap-1 flex-1 pr-8">
                                    <h3 className="text-kepler-navy dark:text-white font-bold text-lg">Introduction to Python</h3>
                                    <p className="text-text-secondary text-sm">Technical Typing</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Hard</span>
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span> 5 min
                                        </span>
                                        <span className="text-xs text-text-secondary">410 words</span>
                                    </div>
                                    <p className="text-kepler-navy/70 dark:text-white/70 text-sm mt-3 line-clamp-2 font-mono">def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Configuration Form */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Settings Card */}
                        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-[#e7f3ee] dark:border-white/10 p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-surface-light dark:border-white/10 pb-4">
                                <span className="material-symbols-outlined text-facilitator-primary">tune</span>
                                <h3 className="text-kepler-navy dark:text-white font-bold text-xl">Session Settings</h3>
                            </div>
                            <form className="flex flex-col gap-6" onSubmit={handlePublish}>
                                {/* Target Section */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-kepler-navy dark:text-white">Target Section</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-lg bg-surface-light dark:bg-white/5 border-transparent focus:border-facilitator-primary focus:bg-white dark:focus:bg-white/10 focus:ring-0 text-kepler-navy dark:text-white py-3 px-4 pr-10"
                                            value={targetSection}
                                            onChange={(e) => setTargetSection(e.target.value)}
                                            required
                                        >
                                            <option disabled value="">Select a class...</option>
                                            <option value="10A">Grade 10 - Section A</option>
                                            <option value="10B">Grade 10 - Section B</option>
                                            <option value="11A">Grade 11 - CS Intro</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Limit */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-kepler-navy dark:text-white flex justify-between">
                                        Time Limit
                                        <span className="text-xs font-normal text-text-secondary">Default: 1 min</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-lg bg-surface-light dark:bg-white/5 border-transparent focus:border-facilitator-primary focus:bg-white dark:focus:bg-white/10 focus:ring-0 text-kepler-navy dark:text-white py-3 px-4 pr-10"
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(e.target.value)}
                                        >
                                            <option value="1">1 Minute</option>
                                            <option value="2">2 Minutes</option>
                                            <option value="3">3 Minutes</option>
                                            <option value="5">5 Minutes</option>
                                            <option value="0">Unlimited</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                                            <span className="material-symbols-outlined">timer</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Allowed Trials */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-kepler-navy dark:text-white flex items-center gap-1">
                                        Allowed Trials
                                        <span className="material-symbols-outlined text-[16px] text-text-secondary cursor-help" title="Number of times a student can attempt this test">info</span>
                                    </label>
                                    <div className="flex items-center bg-surface-light dark:bg-white/5 rounded-lg px-4 py-1">
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 text-kepler-navy dark:text-white font-medium py-2"
                                            min="1"
                                            placeholder="Unlimited"
                                            type="number"
                                            value={allowedTrials}
                                            onChange={(e) => setAllowedTrials(e.target.value)}
                                        />
                                        <span className="text-sm text-text-secondary font-medium">Attempts</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr className="border-surface-light dark:border-white/10 my-2" />

                                {/* Summary / Preview Mini */}
                                <div className="flex flex-col gap-2 bg-[#f8fcfa] dark:bg-white/5 p-3 rounded-lg border border-surface-light dark:border-white/10">
                                    <p className="text-xs font-bold text-text-secondary uppercase">Selected Content</p>
                                    <p className="text-sm font-bold text-kepler-navy dark:text-white truncate">{selectedText}</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-white dark:bg-white/10 border border-surface-light dark:border-white/10 px-1.5 py-0.5 rounded text-text-secondary">182 words</span>
                                        <span className="text-[10px] bg-white dark:bg-white/10 border border-surface-light dark:border-white/10 px-1.5 py-0.5 rounded text-text-secondary">Easy</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 mt-2">
                                    <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-facilitator-primary py-3.5 px-4 text-sm font-bold text-kepler-navy shadow-sm hover:bg-[#0fd683] focus:outline-none focus:ring-2 focus:ring-facilitator-primary focus:ring-offset-2 transition-all">
                                        Publish Test
                                    </button>
                                    <Link to="/facilitator" className="flex w-full items-center justify-center rounded-lg bg-transparent border border-gray-200 dark:border-white/10 py-3.5 px-4 text-sm font-bold text-text-secondary hover:bg-gray-50 dark:hover:bg-white/5 hover:text-kepler-navy dark:hover:text-white focus:outline-none transition-all">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Spacer */}
            <div className="h-20"></div>
        </div>
    );
};

export default FacilitatorTestLaunch;
