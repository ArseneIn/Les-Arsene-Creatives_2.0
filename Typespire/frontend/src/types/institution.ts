export interface Student {
    id: string;
    name: string;
    email: string;
    username?: string;
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

export interface Institution {
    id: string;
    name: string;
    slug: string;
    subscriptionStatus: string;
    subscriptionEndDate?: string;
    address?: string;
    contactEmail?: string;
    maxStudents?: number;
    plan?: string;
}

export interface CreateInstitutionDto {
    name: string;
    slug: string;
    contactEmail: string;
    address: string;
    adminEmail?: string;
    adminPassword?: string;
    adminFirstName?: string;
    adminLastName?: string;
}
