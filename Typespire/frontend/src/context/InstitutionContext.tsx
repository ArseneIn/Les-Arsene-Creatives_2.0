import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

// --- Types ---
export interface Student {
    id: string;
    name: string;
    email: string;
}

export interface Facilitator {
    id: string;
    name: string;
    email: string;
}

export interface Section {
    id: string;
    name: string;
    students: Student[];
    facilitator?: Facilitator;
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
    facilitators: Facilitator[];
    addIntake: (intake: Intake) => void;
    addSection: (intakeId: string, sectionName: string) => void;
    assignFacilitatorToSection: (sectionId: string, facilitatorId: string) => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [facilitators, setFacilitators] = useState<Facilitator[]>([]);

    const fetchIntakes = async (institutionId: string) => {
        try {
            const response = await api.get<any[]>('/intake', {
                params: { institutionId }
            });

            const mappedIntakes: Intake[] = response.data.map(item => ({
                id: item.id,
                name: item.name,
                startDate: new Date(item.startDate).toISOString().split('T')[0],
                endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
                status: item.status === 'ACTIVE' ? 'Active' : item.status === 'ARCHIVED' ? 'Archived' : 'Upcoming',
                facilitators: [], // Backend doesn't support this yet
                sections: item.sections ? item.sections.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    students: s.students || [],
                    facilitator: s.facilitator ? {
                        id: s.facilitator.id,
                        name: `${s.facilitator.firstName || ''} ${s.facilitator.lastName || ''}`.trim() || s.facilitator.email,
                        email: s.facilitator.email
                    } : undefined
                })) : []
            }));

            setIntakes(mappedIntakes);
        } catch (error) {
            console.error('Failed to fetch intakes', error);
        }
    };

    const fetchFacilitators = async (institutionId: string) => {
        try {
            const response = await api.get<any[]>(`/institution/${institutionId}/facilitators`);
            const mappedFacilitators: Facilitator[] = response.data.map(f => ({
                id: f.id,
                name: `${f.firstName || ''} ${f.lastName || ''}`.trim() || f.email,
                email: f.email
            }));
            setFacilitators(mappedFacilitators);
        } catch (error) {
            console.error('Failed to fetch facilitators', error);
        }
    };

    useEffect(() => {
        if (user?.institutionId) {
            fetchIntakes(user.institutionId);
            fetchFacilitators(user.institutionId);
        }
    }, [user?.institutionId]);

    const addIntake = async (intake: Intake) => {
        try {
            if (!user?.institutionId) return;

            await api.post('/intake', {
                name: intake.name,
                startDate: new Date(intake.startDate).toISOString(),
                endDate: new Date(intake.endDate).toISOString(),
                institutionId: user.institutionId
            });

            // Refresh intakes
            fetchIntakes(user.institutionId);
        } catch (error) {
            console.error('Failed to create intake', error);
        }
    };

    const addSection = async (intakeId: string, sectionName: string) => {
        try {
            await api.post('/section', {
                name: sectionName,
                intakeId: intakeId
            });

            // Refresh intakes
            if (user?.institutionId) {
                fetchIntakes(user.institutionId);
            }
        } catch (error) {
            console.error('Failed to create section', error);
        }
    };

    const assignFacilitatorToSection = async (sectionId: string, facilitatorId: string) => {
        try {
            await api.patch(`/section/${sectionId}/assign-facilitator`, {
                facilitatorId
            });

            // Refresh intakes to show updated assignment
            if (user?.institutionId) {
                fetchIntakes(user.institutionId);
            }
        } catch (error) {
            console.error('Failed to assign facilitator', error);
            throw error;
        }
    };

    return (
        <InstitutionContext.Provider value={{ intakes, facilitators, addIntake, addSection, assignFacilitatorToSection }}>
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
