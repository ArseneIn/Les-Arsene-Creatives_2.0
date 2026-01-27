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
}

export interface Assignment {
    id: string;
    title: string;
    sectionId?: string; // Optional if assigned to specific students
    studentIds?: string[]; // Optional list of specific student IDs
    status: 'Active' | 'Scheduled' | 'Completed';
    dueDate: string;
    completionRate: number; // 0-100
}

export interface Section {
    id: string;
    name: string;
    studentCount: number;
    avgWpm: number;
}
