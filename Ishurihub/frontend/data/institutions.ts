export interface Institution {
    id: string;
    name: string;
    type: 'K-12' | 'University' | 'TVET';
    location: string;
    studentCount: number;
    status: 'Active' | 'Pending' | 'Suspended';
    logoUrl: string;
    joinedDate: string;
}

export const mockInstitutions: Institution[] = [
    {
        id: '1',
        name: 'Kigali International School',
        type: 'K-12',
        location: 'Kigali, Rwanda',
        studentCount: 1250,
        status: 'Active',
        logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCheTQTRBiKDh_R17Hi84JJGnwQ0jaxBAcM46A_wtrh7oNR_Afs2d3zwqV-RTuOdCG2JGq1EubjauMW9JB3WzkOu9t77dX7FwNBi0WZZkEywkyut3SE992cjLIDbjUM_W4UOyM4PFceIQmNdPFr6d_sYK8Vw2dy5WWao4eDD200rSs2Irf5U8bHK6KHRrNYt34_FZz1WeaVUTcnQhLXCI1Ibc5iYO4SX5EIIuR2U4xTSj0pJ6FeFmjCoB5f3u3K2PCAcbT8QvRTi5oE',
        joinedDate: '2023-01-15'
    },
    {
        id: '2',
        name: 'Green Hills Academy',
        type: 'K-12',
        location: 'Nyarutarama, Kigali',
        studentCount: 1800,
        status: 'Active',
        logoUrl: 'https://ui-avatars.com/api/?name=Green+Hills&background=0D8ABC&color=fff',
        joinedDate: '2023-03-10'
    },
    {
        id: '3',
        name: 'Riviera High School',
        type: 'K-12',
        location: 'Kabuga, Kigali',
        studentCount: 950,
        status: 'Pending',
        logoUrl: 'https://ui-avatars.com/api/?name=Riviera+High&background=F59E0B&color=fff',
        joinedDate: '2023-10-05'
    },
    {
        id: '4',
        name: 'Rwanda Coding Academy',
        type: 'TVET',
        location: 'Nyabihu, Western Province',
        studentCount: 240,
        status: 'Active',
        logoUrl: 'https://ui-avatars.com/api/?name=RCA&background=10B981&color=fff',
        joinedDate: '2023-06-20'
    }
];
