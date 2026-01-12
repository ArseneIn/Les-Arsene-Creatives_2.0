import React, { createContext, useContext, useState, type ReactNode } from 'react';

// --- Types ---
export interface Student {
    id: string;
    name: string;
    email: string;
}

export interface Section {
    id: string;
    name: string;
    students: Student[];
}

export interface Intake {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Upcoming' | 'Archived';
    facilitators: string[];
    sections: Section[];
}

interface InstitutionContextType {
    intakes: Intake[];
    addIntake: (intake: Intake) => void;
    addSection: (intakeId: string, sectionName: string) => void;
}

// --- Mock Data ---
const MOCK_INTAKES: Intake[] = [
    {
        id: '1',
        name: 'Fall 2024',
        startDate: '2024-09-01',
        endDate: '2024-12-15',
        status: 'Active',
        facilitators: ['Jane Doe', 'John Smith'],
        sections: [
            { id: 's1', name: 'Section A', students: Array(25).fill(null) },
            { id: 's2', name: 'Section B', students: Array(28).fill(null) },
        ]
    },
    {
        id: '2',
        name: 'Spring 2025',
        startDate: '2025-01-15',
        endDate: '2025-05-20',
        status: 'Upcoming',
        facilitators: [],
        sections: []
    }
];

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [intakes, setIntakes] = useState<Intake[]>(MOCK_INTAKES);

    const addIntake = (intake: Intake) => {
        setIntakes([...intakes, intake]);
    };

    const addSection = (intakeId: string, sectionName: string) => {
        setIntakes(prevIntakes => prevIntakes.map(intake => {
            if (intake.id === intakeId) {
                return {
                    ...intake,
                    sections: [...intake.sections, {
                        id: Date.now().toString(),
                        name: sectionName,
                        students: []
                    }]
                };
            }
            return intake;
        }));
    };

    return (
        <InstitutionContext.Provider value={{ intakes, addIntake, addSection }}>
            {children}
        </InstitutionContext.Provider>
    );
};

export const useInstitution = () => {
    const context = useContext(InstitutionContext);
    if (context === undefined) {
        throw new Error('useInstitution must be used within an InstitutionProvider');
    }
    return context;
};
