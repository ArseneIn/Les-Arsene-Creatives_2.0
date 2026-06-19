"use client";

import { motion } from "framer-motion";

const statsData = [
    {
        id: 1,
        title: "Total Students",
        value: "142",
        icon: "groups",
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        trend: "+5.0%",
        trendStyle: "text-green-600 bg-green-50 dark:bg-green-500/10",
        trendIcon: "arrow_upward",
        hoverBorder: "hover:border-blue-500/20"
    },
    {
        id: 2,
        title: "Classes Today",
        value: "4",
        icon: "calendar_today",
        iconBg: "bg-purple-50 dark:bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        trend: "Stable",
        trendStyle: "text-gray-500 bg-gray-100 dark:bg-white/5",
        trendIcon: "",
        hoverBorder: "hover:border-purple-500/20"
    },
    {
        id: 3,
        title: "Pending Tasks",
        value: "12",
        icon: "assignment_late",
        iconBg: "bg-rose-50 dark:bg-rose-500/10",
        iconColor: "text-rose-600 dark:text-rose-400",
        trend: "3 Overdue",
        trendStyle: "text-rose-600 bg-rose-50 dark:bg-rose-500/10",
        trendIcon: "",
        hoverBorder: "hover:border-rose-500/20"
    },
    {
        id: 4,
        title: "Attendance Rate",
        value: "96%",
        icon: "fact_check",
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        trend: "Daily",
        trendStyle: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
        trendIcon: "",
        hoverBorder: "hover:border-amber-500/20"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function TeacherStats() {
    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {statsData.map((stat) => (
                <motion.div 
                    key={stat.id} 
                    variants={item}
                    className={`bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:scale-102 transition-all duration-300 group ${stat.hoverBorder}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 ${stat.iconBg} ${stat.iconColor} rounded-xl group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${stat.trendStyle}`}>
                            {stat.trend}
                            {stat.trendIcon && (
                                <span className="material-symbols-outlined text-[14px] ml-0.5">{stat.trendIcon}</span>
                            )}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

