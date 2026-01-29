"use client";

import { useAuth } from "@/hooks/useAuth";
import HeadTeacherDashboard from "./HeadTeacherDashboard";
import DeanDashboard from "./DeanDashboard";
import DisciplineDashboard from "./DisciplineDashboard";
import LibraryDashboard from "./LibraryDashboard";
import ParentDashboard from "./ParentDashboard";

export default function DashboardResolver() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">Access Denied. Please log in.</div>;
    }

    // Role-based rendering
    switch (user.roleId) {
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
        default:
            // Fallback for unknown roles or custom roles (for now)
            return (
                <div className="p-8">
                    <h2 className="text-xl font-bold mb-4">Welcome, {user.name}</h2>
                    <p className="text-gray-500">Your role ({user.roleId}) does not have a specific dashboard yet.</p>
                </div>
            );
    }
}
