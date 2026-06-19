"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface Classroom {
    id: string;
    name: string;
    level: string;
    stream: string;
    year: string;
}

export default function TeacherClasses() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user) return;
            try {
                const res = await api.get('/teachers/my-classes');
                setClasses(res.data);
            } catch (error) {
                console.error("Failed to fetch my classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user]);

    if (loading) {
        return (
            <div className="p-12 text-center flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-white/5 min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your classes...</p>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-white/5 text-center min-h-[400px] relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 opacity-20"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                
                <div className="bg-primary/10 dark:bg-primary/20 p-5 rounded-full mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl">school</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Classes Assigned</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
                    You haven&apos;t been assigned to any classes for the current academic term yet. The admin will configure your classes shortly.
                </p>
                <button className="px-5 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm font-bold">refresh</span>
                    Check Again
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {classes.map((cls) => (
                <motion.div 
                    key={cls.id} 
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-gray-50/50 dark:bg-slate-900/40 p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-[#1e293b] hover:shadow-md hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-5 relative">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-2xl">meeting_room</span>
                        </div>
                        <div className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400">
                            {cls.year}
                        </div>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">{cls.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">{cls.level} • {cls.stream || 'Main Stream'}</p>

                    <div className="flex gap-3">
                        <Link
                            href={`/school/${user?.schoolId}/teacher/classes/${cls.id}/attendance`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:scale-102 hover:shadow-md hover:shadow-primary/10 transition-all text-xs font-bold rounded-xl"
                        >
                            <span className="material-symbols-outlined text-[18px]">co_present</span>
                            Attendance
                        </Link>
                        <Link
                            href={`#`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold rounded-xl transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">grading</span>
                            Grades
                        </Link>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
