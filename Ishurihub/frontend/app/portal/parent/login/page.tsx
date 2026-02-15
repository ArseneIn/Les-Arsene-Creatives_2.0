"use client";

import LoginLayout from "@/components/auth/LoginLayout";

export default function ParentLoginPage() {
    return (
        <LoginLayout
            title="Parent Portal"
            role="parent"
            themeColor="bg-emerald-600"
            description="Monitor your child's progress and attendance."
            illustration="/images/auth/parent_real.png"
        />
    );
}
