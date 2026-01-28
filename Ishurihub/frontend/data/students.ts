export interface Student {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    section: string;
    cardUid: string | null;
    status: 'Active' | 'Pending' | 'Inactive';
    avatarUrl: string;
}

export const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Johnathan Doe',
        studentId: '2023-0041',
        grade: 'Grade 10',
        section: 'Section B',
        cardUid: '8A2C91B4',
        status: 'Active',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOJBIlSTua6MKiZzuZi6PJn142Ol3olhcg2ZZqbFGc4pFrKvxxD7vNBNpze4OEpnBb7sMlfH-xSsKyIOJzobP-AnjzeQnrwD_aWxw3nlUXFnQf2CnG_C6zKQXXDQTagRS4i_mZQctp38B8Gcdsej5uSzGpdor25P_y8DZIqTh_EFlCCOPyc_RKYSxjstm2wLA1deqWl0YPgpuBCSjELv_MFV65iyKHaLDZoFWr5noIZMH8q6852-ZuNSMV15QC1xE90tC0oRYuBnbs'
    },
    {
        id: '2',
        name: 'Emily Jane Smith',
        studentId: '2023-0112',
        grade: 'Grade 10',
        section: 'Section A',
        cardUid: null,
        status: 'Pending',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkmP--6RJYGgZEayuaL8MQ8FdOlhKBjxzDOa7FtT-JnXi31svCnnEOE6meaClU5avCuP54kv5pPNGtfO_USDAub0Zvuc9TQTnflSRj1lqOz_ScdfSWhpntAFZ8LGIBRztUF7Mc_LSTn-x0hIGLrWcuWpczBJPL49ISQiD-QMFGR8ifZDLvLABWTiXDXqHaNlIQ7F_12YItuJ0XKzd7o3DGVuNgY1cD0LD3t57818WkV-j4wXruY0YXdFFyjN0qMXHY-3YmeixWPA5R'
    },
    {
        id: '3',
        name: 'Robert Brown',
        studentId: '2022-0492',
        grade: 'Grade 11',
        section: 'Section C',
        cardUid: '5E3F10A2',
        status: 'Inactive',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz6mlEq3H8R9KnSrqKjS61Ok1Qgq-_DpLGrJcd5tUr34uh6U97R1usX27tV7cqxFJJ3rsj_BffVuH_L3UrbSqSe2Ef_RDnOkNe00OaLAq2BrWKqNDwzydhCPuPh3USSGZj9zqNl0UKg51o4slXyQa9rZEaxJgvOINHO8jmJb6DpEkhcpxkjQHzaZ8o0lak8TptRoCJdU2Q7XsbHGX_a-3eI3he6CWUGSf6zqv2rHJz-W1u8XYRevTR48H7hcOzr0lNnsJfcQo-RVk9'
    },
    {
        id: '4',
        name: 'Sarah Williams',
        studentId: '2023-0099',
        grade: 'Grade 10',
        section: 'Section B',
        cardUid: 'F9D2E118',
        status: 'Active',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVmiVVitmqJFNI7oAKaTNBuiZ7rsR0ouLgm1dHopQmWqnAwKCJrQjtC3PVdnPfVi_jvoZckHskLRpq-pdif62V7v9y0VVtXxAcs-KJqfGeX83_k-7Aeogxz_ElEVfvhlp8BjeNquTX8-pxHN4QZqFolrb2zGneAjx3_V-VK0ZWVaYQMeImv0Q4XmWAeL0BEk7Ce5mJJrqBDsOK9uQjKKSzicGcQ66HfD3sVjsx8I7a20-OqCmwGZMEDFuo9eVlpNpDSWgsQiZVfDUr'
    }
];
