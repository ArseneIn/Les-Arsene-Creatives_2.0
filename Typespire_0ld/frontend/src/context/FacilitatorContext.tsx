import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Student, Assignment, Section } from '../types/facilitator';
import { MOCK_STUDENTS, MOCK_ASSIGNMENTS, MOCK_SECTIONS } from '../data/facilitatorMock';

// Re-export types for convenience if needed, or consumers should import from types/facilitator
// export type { Student, Assignment, Section };

interface FacilitatorContextType {
    students: Student[];
    assignments: Assignment[];
    sections: Section[];
    publishAssignment: (assignment: Omit<Assignment, 'id' | 'status' | 'completionRate'>) => void;
}

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
