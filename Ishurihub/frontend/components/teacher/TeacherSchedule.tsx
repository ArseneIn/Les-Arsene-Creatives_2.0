"use client";

import { motion } from "framer-motion";

const scheduleData = [
    {
        id: 1,
        time: "08:00 AM",
        duration: "45 min",
        subject: "Mathematics",
        class: "Senior 4 - Science",
        room: "Room 102",
        type: "past"
    },
    {
        id: 2,
        time: "09:00 AM",
        duration: "45 min",
        subject: "Physics",
        class: "Senior 5 - Science",
        room: "Lab 3",
        type: "current"
    },
    {
        id: 3,
        time: "11:30 AM",
        duration: "45 min",
        subject: "Mathematics",
        class: "Senior 6 - Science",
        room: "Room 205",
        type: "upcoming"
    },
    {
        id: 4,
        time: "02:00 PM",
        duration: "90 min",
        subject: "Staff Meeting",
        class: "All Teachers",
        room: "Main Hall",
        type: "upcoming"
    }
];

export default function TeacherSchedule() {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today&apos;s Schedule</h3>
                <button className="text-primary text-xs font-bold hover:underline">View Full</button>
            </div>

            <div className="relative border-l border-gray-100 dark:border-white/5 ml-3 space-y-6">
                {scheduleData.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="relative pl-6"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#1e293b] ${
                            item.type === 'past' ? 'bg-gray-300 dark:bg-slate-700' :
                            item.type === 'current' ? 'bg-primary ring-primary/20' :
                            'bg-primary/50'
                        }`} />

                        <div className={`p-4 rounded-xl border ${
                            item.type === 'current' 
                                ? 'bg-primary/5 border-primary/20 shadow-sm' 
                                : 'bg-gray-50/50 dark:bg-slate-900/30 border-gray-100 dark:border-white/5'
                        }`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold ${
                                    item.type === 'current' ? 'text-primary' : 'text-gray-900 dark:text-white'
                                }`}>
                                    {item.time}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 bg-white dark:bg-[#1e293b] px-2 py-0.5 rounded-lg shadow-sm border border-gray-100 dark:border-white/5">
                                    {item.duration}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.subject}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.class}</p>
                            
                            <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                {item.room}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
