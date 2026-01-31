export interface Student {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    cardUid: string | null;
    section?: string;
    status: 'Active' | 'Pending' | 'Inactive';
    // Academic Info
    level: 'O-Level' | 'A-Level';
    year: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
    combination?: string; // Only for A-Level

    // Personal Info
    dob: string;
    gender: 'Male' | 'Female';
    age: number;

    // Parent Info
    fatherName: string;
    motherName: string;
    primaryPhone: string;
    emergencyPhone: string;
    email?: string;

    avatarUrl: string;
}

export const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Johnathan Doe',
        studentId: '2023-0041',
        grade: 'Grade 10',
        cardUid: '8A2C91B4',
        status: 'Active',
        level: 'O-Level',
        year: 'S1',
        dob: '2008-05-15',
        gender: 'Male',
        age: 15,
        fatherName: 'Michael Doe',
        motherName: 'Sarah Doe',
        primaryPhone: '+250788123456',
        emergencyPhone: '+250788654321',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOJBIlSTua6MKiZzuZi6PJn142Ol3olhcg2ZZqbFGc4pFrKvxxD7vNBNpze4OEpnBb7sMlfH-xSsKyIOJzobP-AnjzeQnrwD_aWxw3nlUXFnQf2CnG_C6zKQXXDQTagRS4i_mZQctp38B8Gcdsej5uSzGpdor25P_y8DZIqTh_EFlCCOPyc_RKYSxjstm2wLA1deqWl0YPgpuBCSjELv_MFV65iyKHaLDZoFWr5noIZMH8q6852-ZuNSMV15QC1xE90tC0oRYuBnbs'
    },
    {
        id: '2',
        name: 'Emily Jane Smith',
        studentId: '2023-0112',
        grade: 'Grade 10',
        cardUid: null,
        status: 'Pending',
        level: 'O-Level',
        year: 'S1',
        dob: '2008-08-20',
        gender: 'Female',
        age: 15,
        fatherName: 'John Smith',
        motherName: 'Jane Smith',
        primaryPhone: '+250788111222',
        emergencyPhone: '+250788333444',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkmP--6RJYGgZEayuaL8MQ8FdOlhKBjxzDOa7FtT-JnXi31svCnnEOE6meaClU5avCuP54kv5pPNGtfO_USDAub0Zvuc9TQTnflSRj1lqOz_ScdfSWhpntAFZ8LGIBRztUF7Mc_LSTn-x0hIGLrWcuWpczBJPL49ISQiD-QMFGR8ifZDLvLABWTiXDXqHaNlIQ7F_12YItuJ0XKzd7o3DGVuNgY1cD0LD3t57818WkV-j4wXruY0YXdFFyjN0qMXHY-3YmeixWPA5R'
    },
    {
        id: '3',
        name: 'Robert Brown',
        studentId: '2022-0492',
        grade: 'Grade 11',
        cardUid: '5E3F10A2',
        status: 'Inactive',
        level: 'A-Level',
        year: 'S5',
        combination: 'PCM',
        dob: '2006-03-10',
        gender: 'Male',
        age: 17,
        fatherName: 'David Brown',
        motherName: 'Lisa Brown',
        primaryPhone: '+250788999888',
        emergencyPhone: '+250788777666',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz6mlEq3H8R9KnSrqKjS61Ok1Qgq-_DpLGrJcd5tUr34uh6U97R1usX27tV7cqxFJJ3rsj_BffVuH_L3UrbSqSe2Ef_RDnOkNe00OaLAq2BrWKqNDwzydhCPuPh3USSGZj9zqNl0UKg51o4slXyQa9rZEaxJgvOINHO8jmJb6DpEkhcpxkjQHzaZ8o0lak8TptRoCJdU2Q7XsbHGX_a-3eI3he6CWUGSf6zqv2rHJz-W1u8XYRevTR48H7hcOzr0lNnsJfcQo-RVk9'
    },
    {
        id: '4',
        name: 'Sarah Williams',
        studentId: '2023-0099',
        grade: 'Grade 10',
        cardUid: 'F9D2E118',
        status: 'Active',
        level: 'O-Level',
        year: 'S2',
        dob: '2007-11-25',
        gender: 'Female',
        age: 16,
        fatherName: 'James Williams',
        motherName: 'Mary Williams',
        primaryPhone: '+250788555444',
        emergencyPhone: '+250788222111',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVmiVVitmqJFNI7oAKaTNBuiZ7rsR0ouLgm1dHopQmWqnAwKCJrQjtC3PVdnPfVi_jvoZckHskLRpq-pdif62V7v9y0VVtXxAcs-KJqfGeX83_k-7Aeogxz_ElEVfvhlp8BjeNquTX8-pxHN4QZqFolrb2zGneAjx3_V-VK0ZWVaYQMeImv0Q4XmWAeL0BEk7Ce5mJJrqBDsOK9uQjKKSzicGcQ66HfD3sVjsx8I7a20-OqCmwGZMEDFuo9eVlpNpDSWgsQiZVfDUr'
    }
];
