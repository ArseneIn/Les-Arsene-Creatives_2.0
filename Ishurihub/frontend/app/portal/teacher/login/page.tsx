"use client";

import LoginLayout from "@/components/auth/LoginLayout";

export default function TeacherLoginPage() {
    return (
        <LoginLayout
            title="Teacher Portal"
            role="teacher"
            themeColor="bg-purple-600" // A distinctive purple for teachers
            description="Manage classes, attendance, and grading."
            illustration="/images/auth/teacher_3d.png"
        />
    );
}
