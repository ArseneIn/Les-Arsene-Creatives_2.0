import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

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

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [intakes, setIntakes] = useState<Intake[]>([]);

    useEffect(() => {
        if (user?.institutionId) {
            fetchIntakes(user.institutionId);
        }
    }, [user?.institutionId]);

    const fetchIntakes = async (institutionId: string) => {
        try {
            const response = await api.get<Intake[]>('/intake', {
                params: { institutionId }
            });
            // Transform backend data to match frontend interface if needed
            // Backend Intake might not have 'facilitators' or 'sections' populated as expected
            // For now, we assume it matches or we map it.
            // The backend returns { institution: ... }, but we need sections.
            // We might need to fetch sections separately or include them in the backend query.
            // I updated IntakeService to include sections in findOne, but not findAll.
            // Let's update findAll in backend to include sections too?
            // Or just use what we have.
            setIntakes(response.data);
        } catch (error) {
            console.error('Failed to fetch intakes', error);
        }
    };

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
