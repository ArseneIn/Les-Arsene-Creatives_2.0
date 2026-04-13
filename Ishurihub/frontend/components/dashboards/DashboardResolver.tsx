"use client";

import { useAuth } from "@/hooks/useAuth";
import HeadTeacherDashboard from "./HeadTeacherDashboard";
import DeanDashboard from "./DeanDashboard";
import DisciplineDashboard from "./DisciplineDashboard";
import LibraryDashboard from "./LibraryDashboard";
import ParentDashboard from "./ParentDashboard";

import SchoolAdminDashboard from "./SchoolAdminDashboard";
import StudentDashboard from "./StudentDashboard";

import LoadingScreen from "../system/LoadingScreen";

export default function DashboardResolver() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen message="Preparing your workspace..." fullScreen={false} />;
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied. Please log in.</div>;
    }

    // Role-based rendering
    switch (user.roleId) {
        case 'super_admin':
        case 'school_admin':
            return <SchoolAdminDashboard />;
        case 'head_teacher':
            return <HeadTeacherDashboard />;
        case 'dean_studies':
            return <DeanDashboard />;
        case 'discipline_master':
            return <DisciplineDashboard />;
        case 'library_manager':
            return <LibraryDashboard />;
        case 'parent':
            return <ParentDashboard />;
        case 'student':
            return <StudentDashboard />;
        default:
            // Fallback for unknown roles or custom roles (for now)
            return (
                <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">account_circle</span>
                    <h2 className="text-xl font-bold mb-2">Welcome, {user.name}</h2>
                    <p className="text-gray-500 font-medium">Your role ({user.roleId}) does not have a specialized dashboard yet.</p>
                </div>
            );
    }
}
