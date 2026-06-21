"use client";

export const dynamic = 'force-dynamic';

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Define the role types and their configurations
type Role = 'student' | 'teacher' | 'parent' | 'admin';

interface RoleConfig {
    id: Role;
    title: string;
    description: string;
    icon: string;
    color: string;      // Tailwind class for text
    gradient: string;   // Tailwind gradient for active state
    bgColor: string;    // Hex for page background
    path: string;
    animation: Variants;     // Framer motion variants for the icon
}

const roles: RoleConfig[] = [
    {
        id: 'student',
        title: 'Student',
        description: 'Access courses & grades',
        icon: 'backpack',
        color: 'text-cyan-600',
        gradient: 'from-cyan-500/40 to-blue-500/10',
        bgColor: '#ecfeff',
        path: '/portal/student/login',
        animation: {
            hover: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
        }
    },
    {
        id: 'parent',
        title: 'Parent',
        description: 'Monitor progress',
        icon: 'family_restroom',
        color: 'text-emerald-600',
        gradient: 'from-emerald-500/40 to-green-500/10',
        bgColor: '#ecfdf5',
        path: '/portal/parent/login',
        animation: {
            hover: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
        }
    },
    {
        id: 'teacher',
        title: 'Teacher',
        description: 'Manage classes & grading',
        icon: 'cast_for_education',
        color: 'text-violet-600',
        gradient: 'from-violet-500/40 to-purple-500/10',
        bgColor: '#f5f3ff',
        path: '/portal/teacher/login',
        animation: {
            hover: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
        }
    },
    {
        id: 'admin',
        title: 'Admin',
        description: 'System administration',
        icon: 'admin_panel_settings',
        color: 'text-slate-700',
        gradient: 'from-slate-500/40 to-gray-500/10',
        bgColor: '#f1f5f9',
        path: '/admin/portal/login',
        animation: {
            hover: { rotate: 360, transition: { duration: 3, ease: "linear", repeat: Infinity } }
        }
    }
];

export default function PortalSelectionPage() {
    const router = useRouter();
    const [hoveredRole, setHoveredRole] = useState<Role | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        let active = true;
        setTimeout(() => {
            if (active) setIsMounted(true);
        }, 0);
        return () => {
            active = false;
        };
    }, []);

    const handleRoleSelect = (role: RoleConfig) => {
        setSelectedRole(role.id);
        setTimeout(() => {
            router.push(role.path);
        }, 600);
    };

    // Determine current accent color for the top-right gradient
    const currentAccentColor = (selectedRole
        ? roles.find(r => r.id === selectedRole)?.color.replace('text-', '')
        : hoveredRole
            ? roles.find(r => r.id === hoveredRole)?.color.replace('text-', '')
            : 'slate-400') ?? 'slate-400';

    return (
        <div
            className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50/50 ${!isMounted ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        >
            {/* Dynamic Page Background Gradient - Top Right */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                animate={{
                    background: `radial-gradient(circle at 100% 0%, var(--tw-color-${currentAccentColor.replace('-600', '-500')}) 0%, transparent 60%)`,
                    opacity: hoveredRole || selectedRole ? 0.5 : 0
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ mixBlendMode: 'normal' }}
            />

            {/* Hardcoded gradients for tailwind color resolution since css vars might be tricky dynamically in verify */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ease-in-out"
                style={{
                    opacity: hoveredRole || selectedRole ? 0.4 : 0,
                    background: `radial-gradient(circle at 100% 0%, ${(selectedRole || hoveredRole) === 'student' ? '#06b6d4' :
                        (selectedRole || hoveredRole) === 'parent' ? '#10b981' :
                            (selectedRole || hoveredRole) === 'teacher' ? '#8b5cf6' :
                                (selectedRole || hoveredRole) === 'admin' ? '#64748b' : 'transparent'
                        } 0%, transparent 60%)`
                }}
            />

            {/* Secondary Bottom Left Gradient for balance */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                animate={{
                    background: `radial-gradient(circle at 0% 100%, var(--tw-color-${currentAccentColor.replace('-600', '-500')}) 0%, transparent 50%)`,
                    opacity: hoveredRole || selectedRole ? 0.25 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />

            <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-20">

                {/* Left Side: Branding & Info */}
                <motion.div
                    className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:w-1/2"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white shadow-xl shadow-black/5 mb-2">
                        <span className="material-symbols-outlined text-5xl text-primary">school</span>
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
                            Ishuri<span className="text-primary">Hub</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium mt-4 max-w-md leading-relaxed">
                            Welcome back. Please select your portal to access the dashboard.
                        </p>
                    </div>

                    <div className="hidden md:flex gap-3 mt-4">
                        <div className="h-2 w-12 rounded-full bg-primary/20"></div>
                        <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                        <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                    </div>
                </motion.div>

                {/* Right Side: Compact Cards Grid */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <AnimatePresence>
                        {roles.map((role, index) => (
                            <motion.button
                                key={role.id}
                                onClick={() => handleRoleSelect(role)}
                                onMouseEnter={() => setHoveredRole(role.id)}
                                onMouseLeave={() => setHoveredRole(null)}
                                className={`
                                    relative flex items-center p-4 rounded-2xl bg-white/60 backdrop-blur-xl
                                    border border-white/50 hover:border-gray-200/50 hover:bg-white/80
                                    shadow-sm hover:shadow-lg transition-all duration-300 group w-full text-left
                                    overflow-hidden
                                    ${selectedRole && selectedRole !== role.id ? 'opacity-40 blur-[2px]' : 'opacity-100'}
                                    ${selectedRole === role.id ? 'scale-105 !bg-white ring-2 ring-primary/20 z-20' : ''}
                                `}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Active Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-bl ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

                                {/* Icon Container */}
                                <motion.div
                                    className={`
                                        relative z-10 size-12 rounded-xl flex items-center justify-center 
                                        bg-white shadow-sm border border-gray-100 group-hover:border-transparent transition-colors
                                        shrink-0 mr-4
                                    `}
                                    variants={{ hover: role.animation.hover }}
                                    animate={hoveredRole === role.id ? "hover" : "initial"}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${role.color}`}>
                                        {role.icon}
                                    </span>
                                </motion.div>

                                {/* Text Content */}
                                <div className="relative z-10 flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                                        {role.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium truncate group-hover:text-gray-600 transition-colors">
                                        {role.description}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <div className="relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-gray-400">
                                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Dot Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.4]"
                    style={{
                        backgroundImage: `radial-gradient(${selectedRole || hoveredRole ? (roles.find(r => r.id === (selectedRole || hoveredRole))?.color.replace('text-', 'bg-') === 'text-cyan-600' ? '#0891b2' : roles.find(r => r.id === (selectedRole || hoveredRole))?.color.replace('text-', 'bg-') === 'text-emerald-600' ? '#059669' : roles.find(r => r.id === (selectedRole || hoveredRole))?.color.replace('text-', 'bg-') === 'text-violet-600' ? '#7c3aed' : '#334155') : '#94a3b8'} 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                        transition: 'background-image 0.5s ease-in-out'
                    }}
                />

                {/* Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ filter: 'contrast(320%) brightness(100%)' }}>
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <filter id="noiseFilter">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                    </svg>
                </div>

                {/* Animated Floating Shapes */}
                <motion.div
                    className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full border border-gray-900/5 bg-white/5 backdrop-blur-3xl"
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-[2rem] border border-gray-900/5 bg-white/5 backdrop-blur-3xl"
                    animate={{
                        y: [0, 60, 0],
                        rotate: [0, -15, 15, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

            </div>
        </div>
    );
}
