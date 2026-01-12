import type { Student, Assignment, Section } from '../types/facilitator';

export const MOCK_STUDENTS: Student[] = [
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

export const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: '101', title: 'Week 1 Assessment', sectionId: '10A', status: 'Completed', dueDate: 'Oct 15, 2023', completionRate: 98 },
    { id: '102', title: 'Home Row Drills', sectionId: '10B', status: 'Active', dueDate: 'Oct 25, 2023', completionRate: 45 },
];

export const MOCK_SECTIONS: Section[] = [
    { id: '10A', name: 'Grade 10 - Section A', studentCount: 24, avgWpm: 45 },
    { id: '10B', name: 'Grade 10 - Section B', studentCount: 22, avgWpm: 38 },
    { id: '11A', name: 'Grade 11 - CS Intro', studentCount: 18, avgWpm: 52 },
];
