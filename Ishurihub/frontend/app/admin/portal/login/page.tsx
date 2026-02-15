"use client";

import LoginLayout from "@/components/auth/LoginLayout";

export default function SuperAdminLoginPage() {
    return (
        <LoginLayout
            title="Admin Portal"
            role="super_admin"
            themeColor="bg-slate-900" // Dark and serious for admin
            description="Restricted access for System Administrators."
            allowSuperAdmin={true}
            illustration="/images/auth/admin_real.png"
        />
    );
}
