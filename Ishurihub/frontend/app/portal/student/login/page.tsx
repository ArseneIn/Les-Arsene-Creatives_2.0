"use client";

import LoginLayout from "@/components/auth/LoginLayout";

export default function StudentLoginPage() {
    return (
        <LoginLayout
            title="Student Portal"
            role="student"
            themeColor="bg-blue-600"
            description="Access your courses, grades, and assignments."
            illustration="/images/auth/student_real.png"
        />
    );
}
