import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Student, Assignment, Section, AssignmentStudentResult } from '../types/facilitator';
import { useAuth } from './AuthContext';
import { useInstitution } from './InstitutionContext';
import api from '../api/axios';

interface FacilitatorContextType {
    students: Student[];
    assignments: Assignment[];
    sections: Section[];
    publishAssignment: (assignment: Omit<Assignment, 'id' | 'status' | 'completionRate'>) => Promise<void>;
    submitTestResult: (studentId: string, wpm: number, accuracy: number) => void;
    fetchAssignmentResults: (assignmentId: string) => Promise<AssignmentStudentResult[]>;
}

const FacilitatorContext = createContext<FacilitatorContextType | undefined>(undefined);

export const FacilitatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { intakes } = useInstitution();
    
    // Manage published assignments dynamically from database
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    
    // Manage students reactive list
    const [studentsList, setStudentsList] = useState<Student[]>([]);

    // 1. Map live sections assigned to this facilitator
    const facilitatedSections: Section[] = intakes.flatMap(intake => 
        (intake.sections || [])
            .filter(section => section.facilitator?.id === user?.id)
            .map(section => {
                const sectionStudents = studentsList.filter(s => s.sectionId === section.id);
                const avgWpm = sectionStudents.length > 0 
                    ? Math.round(sectionStudents.reduce((sum, s) => sum + s.currentWpm, 0) / sectionStudents.length)
                    : 0;

                return {
                    id: section.id,
                    name: section.name,
                    intakeName: intake.name,
                    studentCount: section.students?.length || 0,
                    avgWpm
                };
            })
    );

    // Sync student directories when intakes/user changes
    useEffect(() => {
        const fetchStudentStats = async () => {
            if (user?.role === 'FACILITATOR') {
                try {
                    const res = await api.get(`/analytics/facilitator/${user.id}`);
                    if (res.data && res.data.students) {
                        interface BackendStudent {
                            id: string;
                            name: string;
                            sectionName: string;
                            sectionId?: string | null;
                            avgWpm: number;
                            avgAccuracy: number;
                            testsTaken: number;
                            lastActive?: string | null;
                        }
                        const mapped: Student[] = res.data.students.map((s: BackendStudent) => ({
                            id: s.id,
                            name: s.name,
                            avatarUrl: '',
                            major: s.sectionName,
                            sectionId: s.sectionId || '', // Mapped correctly from backend
                            currentWpm: s.avgWpm,
                            accuracy: s.avgAccuracy,
                            levelProgress: s.testsTaken > 0 ? 50 : 0, // Mock progress
                            status: s.avgWpm >= 30 ? 'On Track' : 'Needs Support',
                            lastActive: s.lastActive ? new Date(s.lastActive).toLocaleDateString() : 'Inactive'
                        }));
                        setStudentsList(mapped);
                    }
                } catch (e) {
                    console.error("Failed to fetch facilitator stats", e);
                }
            } else {
                // Fallback for non-facilitators or if needed
                const mapped: Student[] = intakes.flatMap(intake => 
                    (intake.sections || [])
                        .filter(section => section.facilitator?.id === user?.id)
                        .flatMap(section => 
                            (section.students || []).map(student => ({
                                id: student.id,
                                name: student.name,
                                avatarUrl: '',
                                major: intake.name,
                                sectionId: section.id,
                                currentWpm: 0,
                                accuracy: 0,
                                levelProgress: 0,
                                status: 'On Track' as const,
                                lastActive: 'Active'
                            }))
                        )
                );
                setStudentsList(mapped);
            }
        };
        fetchStudentStats();
    }, [intakes, user]);

    // Fetch persistent database assignments
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user) return;
            try {
                let response;
                if (user.role === 'STUDENT') {
                    const params = new URLSearchParams({ studentId: user.id });
                    if (user.sectionId) params.append('sectionId', user.sectionId);
                    response = await api.get(`/assignment/student?${params.toString()}`);
                } else if (user.role === 'FACILITATOR') {
                    response = await api.get(`/assignment/facilitator/${user.id}`);
                }

                  if (response && response.data) {
                     interface DBResponse {
                         id: string;
                         title: string;
                         dueDate: string;
                         status: string;
                         sectionId?: string | null;
                         studentIds?: string[];
                         maxAttempts?: number;
                         testId?: string | null;
                         wpmRequirement?: number | null;
                         accuracyRequirement?: number | null;
                         test?: {
                             id: string;
                             duration: number;
                             difficulty: string;
                             content: string;
                         };
                     }

                     const mapped: Assignment[] = response.data.map((item: DBResponse) => ({
                         id: item.id,
                         title: item.title,
                         dueDate: new Date(item.dueDate).toLocaleDateString(),
                         dueDateISO: item.dueDate, // Keep ISO for countdown timers
                         status: item.status === 'ACTIVE' ? 'Active' : 'Completed',
                         completionRate: 0,
                         sectionId: item.sectionId || undefined,
                         studentIds: item.studentIds || [],
                         duration: item.test?.duration,
                         maxAttempts: item.maxAttempts || 1,
                         testId: item.testId || item.test?.id || undefined,
                         level: item.test?.difficulty === 'HARD' ? 2 : 1,
                         text: item.test?.content,
                         wpmRequirement: item.wpmRequirement || undefined,
                         accuracyRequirement: item.accuracyRequirement || undefined
                     }));
                    setAssignments(mapped);
                }
            } catch (error) {
                console.error('Failed to fetch assignments from database', error);
            }
        };

         
        fetchAssignments();
    }, [user]);

    const publishAssignment = async (newAssignment: Omit<Assignment, 'id' | 'status' | 'completionRate'>) => {
        try {
            const formattedDate = newAssignment.dueDate.includes('/')
                ? new Date(newAssignment.dueDate.split('/').reverse().join('-')).toISOString()
                : new Date(newAssignment.dueDate).toISOString();

            const response = await api.post('/assignment', {
                title: newAssignment.title,
                dueDate: formattedDate,
                sectionId: newAssignment.sectionId || null,
                studentIds: newAssignment.studentIds || [],
                level: newAssignment.level,
                duration: newAssignment.duration,
                maxAttempts: newAssignment.maxAttempts || 1,
                wpmRequirement: newAssignment.wpmRequirement,
                accuracyRequirement: newAssignment.accuracyRequirement,
                content: newAssignment.text
            });

            interface DBResponse {
                id: string;
                title: string;
                dueDate: string;
                status: string;
                sectionId?: string | null;
                studentIds?: string[];
                maxAttempts?: number;
                testId?: string | null;
                test?: {
                    id: string;
                    duration: number;
                    difficulty: string;
                    content: string;
                };
            }

            const created: DBResponse = response.data;
            const mapped: Assignment = {
                id: created.id,
                title: created.title,
                dueDate: new Date(created.dueDate).toLocaleDateString(),
                status: created.status === 'ACTIVE' ? 'Active' : 'Completed',
                completionRate: 0,
                sectionId: created.sectionId || undefined,
                studentIds: created.studentIds || [],
                duration: created.test?.duration,
                maxAttempts: created.maxAttempts || 1,
                testId: created.testId || created.test?.id || undefined,
                level: created.test?.difficulty === 'HARD' ? 2 : 1,
                text: created.test?.content
            };

            setAssignments(prev => [mapped, ...prev]);
        } catch (error) {
            console.error('Failed to publish assignment to database', error);
        }
    };

    const submitTestResult = (studentId: string, wpm: number, accuracy: number) => {
        setStudentsList(prev => prev.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    currentWpm: wpm,
                    accuracy: accuracy,
                    levelProgress: Math.min(100, Math.round((wpm / 50) * 100)), // Map progress relative to target 50 WPM
                    status: wpm > 40 ? 'On Track' : wpm > 20 ? 'Near Threshold' : 'At Risk',
                    lastActive: 'Just Now'
                };
            }
            return student;
        }));
    };

    const fetchAssignmentResults = async (assignmentId: string): Promise<AssignmentStudentResult[]> => {
        try {
            const response = await api.get<AssignmentStudentResult[]>(`/test-result/assignment/${assignmentId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assignment results', error);
            return [];
        }
    };

    return (
        <FacilitatorContext.Provider value={{ 
            students: studentsList, 
            assignments, 
            sections: facilitatedSections, 
            publishAssignment,
            submitTestResult,
            fetchAssignmentResults
        }}>
            {children}
        </FacilitatorContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFacilitator = () => {
    const context = useContext(FacilitatorContext);
    if (context === undefined) {
        throw new Error('useFacilitator must be used within a FacilitatorProvider');
    }
    return context;
};
