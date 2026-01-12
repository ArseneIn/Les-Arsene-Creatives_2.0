import React, { createContext, useContext, useState, type ReactNode } from 'react';

// --- Types ---

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
    sectionId: string;
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

interface FacilitatorContextType {
    students: Student[];
    assignments: Assignment[];
    sections: Section[];
    publishAssignment: (assignment: Omit<Assignment, 'id' | 'status' | 'completionRate'>) => void;
}

// --- Mock Data ---

const MOCK_STUDENTS: Student[] = [
    {
        id: '1',
        name: 'Sarah Jenkins',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNU6XUCvs2GZa5-ZW_8GHhNQIgQw8URp_XGG6wImplxGREFJQ9aoEPragT3TE_TdpnttRL3afMsli34zxbBtkqxayp2ZXPvS7fPA10M38SazVpeh_bBPHScREVnVn5TWG7qPwzVLYbIoOAlNXhaC1jT3sZpG2JVu8Mk5xcHqpTBvY9CWSq7_49c35IaJcWedcAOy-lwGIyDudcpMGDUJBVd6kknh0NMOA-xwPeohnzt-c1B0B_kWSd1y0FbDOIEeDwCBSivs6AE7R0',
        major: 'BAPM',
        sectionId: '10A',
        currentWpm: 55,
        accuracy: 98,
        levelProgress: 85,
        status: 'On Track',
        lastActive: '2h ago'
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatarUrl: '', // Fallback needed
        major: 'BScBA',
        sectionId: '10A',
        currentWpm: 42,
        accuracy: 94,
        levelProgress: 60,
        status: 'Near Threshold',
        lastActive: '1d ago'
    },
    {
        id: '3',
        name: 'Jessica Alverez',
        avatarUrl: '',
        major: 'SNHU',
        sectionId: '10B',
        currentWpm: 28,
        accuracy: 88,
        levelProgress: 30,
        status: 'At Risk',
        lastActive: '3d ago'
    },
    {
        id: '4',
        name: 'David Kim',
        avatarUrl: '',
        major: 'BAPM',
        sectionId: '11A',
        currentWpm: 65,
        accuracy: 99,
        levelProgress: 95,
        status: 'On Track',
        lastActive: '5m ago'
    },
    {
        id: '5',
        name: 'Emily Davis',
        avatarUrl: '',
        major: 'BScBA',
        sectionId: '10A',
        currentWpm: 48,
        accuracy: 96,
        levelProgress: 72,
        status: 'On Track',
        lastActive: '4h ago'
    }
];

const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: '101', title: 'Week 1 Assessment', sectionId: '10A', status: 'Completed', dueDate: 'Oct 15, 2023', completionRate: 98 },
    { id: '102', title: 'Home Row Drills', sectionId: '10B', status: 'Active', dueDate: 'Oct 25, 2023', completionRate: 45 },
];

const MOCK_SECTIONS: Section[] = [
    { id: '10A', name: 'Grade 10 - Section A', studentCount: 24, avgWpm: 45 },
    { id: '10B', name: 'Grade 10 - Section B', studentCount: 22, avgWpm: 38 },
    { id: '11A', name: 'Grade 11 - CS Intro', studentCount: 18, avgWpm: 52 },
];

// --- Context & Provider ---

const FacilitatorContext = createContext<FacilitatorContextType | undefined>(undefined);

export const FacilitatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [students] = useState<Student[]>(MOCK_STUDENTS);
    const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
    const [sections] = useState<Section[]>(MOCK_SECTIONS);

    const publishAssignment = (newAssignment: Omit<Assignment, 'id' | 'status' | 'completionRate'>) => {
        const assignment: Assignment = {
            ...newAssignment,
            id: Date.now().toString(),
            status: 'Active',
            completionRate: 0
        };
        setAssignments(prev => [assignment, ...prev]);
    };

    return (
        <FacilitatorContext.Provider value={{ students, assignments, sections, publishAssignment }}>
            {children}
        </FacilitatorContext.Provider>
    );
};

export const useFacilitator = () => {
    const context = useContext(FacilitatorContext);
    if (context === undefined) {
        throw new Error('useFacilitator must be used within a FacilitatorProvider');
    }
    return context;
};
