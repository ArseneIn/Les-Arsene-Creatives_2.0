export interface Student {
    id: string;
    name: string;
    avatarUrl: string;
    major: string;
    sectionId: string;
    currentWpm: number;
    accuracy: number;
    levelProgress: number; // 0-100
    status: 'On Track' | 'Near Threshold' | 'At Risk';
    lastActive: string;
    email?: string;
    username?: string;
}

export interface Assignment {
    id: string;
    title: string;
    sectionId?: string; // Optional if assigned to specific students
    studentIds?: string[]; // Optional list of specific student IDs
    status: 'Active' | 'Scheduled' | 'Completed';
    dueDate: string;
    dueDateISO?: string;     // ISO string for precise countdown computation
    completionRate: number; // 0-100
    level?: 1 | 2;          // Test level: 1 = Standard, 2 = Survival
    text?: string;           // Custom test text (optional, falls back to system default)
    duration?: number;       // Duration in seconds (optional)
    maxAttempts?: number;    // Number of attempts allowed (optional, defaults to 1)
    testId?: string;         // Associated test database ID
    wpmRequirement?: number; // Pass WPM
    accuracyRequirement?: number; // Pass Accuracy
    facilitatorName?: string; // Display name of assigning facilitator
    bypassLevel?: boolean; // Bypass level check (testing mode)
    attendanceDate?: string; // Target specific attendance date (optional)
}

export interface Section {
    id: string;
    name: string;
    intakeName?: string;
    studentCount: number;
    avgWpm: number;
}

export interface AssignmentStudentResult {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    username: string | null;
    attempts: number;
    bestWpm: number;
    bestAccuracy: number;
    durationSec: number;
    passed: boolean;
    submittedAt: string;
}
