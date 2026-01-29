export interface Teacher {
    id: string;
    name: string;
    email: string;
    subject: string;
    classes: string[];
    phone: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    avatarUrl: string;
    joinedDate: string;
}

export const mockTeachers: Teacher[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.j@school.com',
        subject: 'Mathematics',
        classes: ['S1 A', 'S2 B', 'S4 PCM'],
        phone: '+250 788 111 222',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random',
        joinedDate: '2020-01-15'
    },
    {
        id: '2',
        name: 'David Smith',
        email: 'david.s@school.com',
        subject: 'Physics',
        classes: ['S3 A', 'S5 PCB'],
        phone: '+250 788 333 444',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=David+Smith&background=random',
        joinedDate: '2019-05-20'
    },
    {
        id: '3',
        name: 'Grace Mutoni',
        email: 'grace.m@school.com',
        subject: 'English',
        classes: ['S1 B', 'S2 A'],
        phone: '+250 788 555 666',
        status: 'On Leave',
        avatarUrl: 'https://ui-avatars.com/api/?name=Grace+Mutoni&background=random',
        joinedDate: '2021-09-01'
    },
    {
        id: '4',
        name: 'Robert Kagame',
        email: 'robert.k@school.com',
        subject: 'History',
        classes: ['S3 B', 'S6 HEG'],
        phone: '+250 788 777 888',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Robert+Kagame&background=random',
        joinedDate: '2018-02-10'
    },
    {
        id: '5',
        name: 'Sarah Uwase',
        email: 'sarah.u@school.com',
        subject: 'Chemistry',
        classes: ['S2 B', 'S4 PCB'],
        phone: '+250 788 999 000',
        status: 'Inactive',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Uwase&background=random',
        joinedDate: '2022-01-05'
    }
];
