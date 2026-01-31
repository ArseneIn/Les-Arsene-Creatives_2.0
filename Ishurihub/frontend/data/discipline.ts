import { Student, mockStudents } from "./students";

export type DisciplineType = 'Merit' | 'Sanction' | 'Report';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DisciplineRecord {
    id: string;
    studentId: string; // References Student.id
    student?: Student; // Populated by API
    type: DisciplineType;
    category: string; // e.g., "Late Arrival", "Homework Missing", "Helping a Peer"
    description: string;
    date: string;
    reportedBy: string; // Teacher name
    severity?: SeverityLevel; // Only for Sanctions
    points?: number; // +/- points
    status: 'Pending' | 'Resolved' | 'Archived';
    actionTaken?: string;
}

export const mockDisciplineRecords: DisciplineRecord[] = [
    {
        id: '1',
        studentId: '1', // Johnathan Doe
        type: 'Sanction',
        category: 'Late Arrival',
        description: 'Arrived 15 minutes late to first period without a valid excuse.',
        date: '2024-03-10',
        reportedBy: 'Mr. Teacher',
        severity: 'Low',
        points: -2,
        status: 'Resolved',
        actionTaken: 'Verbal Warning'
    },
    {
        id: '2',
        studentId: '2', // Emily Jane Smith
        type: 'Merit',
        category: 'Class Participation',
        description: 'Excellent contribution to the history debate.',
        date: '2024-03-12',
        reportedBy: 'Mrs. History',
        points: 5,
        status: 'Archived'
    },
    {
        id: '3',
        studentId: '3', // Robert Brown
        type: 'Sanction',
        category: 'Disruptive Behavior',
        description: 'Talking loudly during exam review.',
        date: '2024-03-14',
        reportedBy: 'Mr. Math',
        severity: 'Medium',
        points: -5,
        status: 'Pending',
        actionTaken: 'Detention assigned'
    },
    {
        id: '4',
        studentId: '1',
        type: 'Merit',
        category: 'Volunteering',
        description: 'Helped organize the library books after school.',
        date: '2024-03-15',
        reportedBy: 'Ms. Librarian',
        points: 10,
        status: 'Archived'
    }
];

// Helper to get student details for a record
export const getStudentForRecord = (record: DisciplineRecord): Student | undefined => {
    return mockStudents.find(s => s.id === record.studentId);
};
