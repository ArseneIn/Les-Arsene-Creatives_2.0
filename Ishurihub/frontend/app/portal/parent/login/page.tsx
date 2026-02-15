"use client";

import LoginLayout from "@/components/auth/LoginLayout";

export default function ParentLoginPage() {
    return (
        <LoginLayout
            title="Parent Portal"
            role="parent"
            themeColor="bg-green-600" // A nice trusted green for parents
            description="Monitor your child's progress and manage school fees."
        />
    );
}
