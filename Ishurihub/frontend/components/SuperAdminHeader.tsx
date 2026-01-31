"use client";

import React, { useState } from 'react';

export default function SuperAdminHeader() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search schools, users, or settings..."
                        className="w-full py-2.5 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium rounded-xl border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-xs text-slate-400 font-medium bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">⌘K</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                    <span className="material-symbols-outlined text-[24px] group-hover:animate-swing">notifications</span>
                    <span className="absolute top-2.5 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                {/* Theme Toggle (Placeholder - functionality usually in context) */}
                {/* <button className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <span className="material-symbols-outlined text-[24px]">dark_mode</span>
                </button> */}

                {/* Profile Dropdown Trigger (Avatar is already in Sidebar, but maybe small one here?) */}
                {/* Keeping it simple for now as sidebar has profile. Maybe add specific quick actions? */}
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Super Admin</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">System Owner</p>
                    </div>
                    {/* <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 shadow-lg shadow-primary/25"></div> */}
                </div>
            </div>
        </header>
    );
}
