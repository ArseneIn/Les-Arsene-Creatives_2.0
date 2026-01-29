export interface Transaction {
    id: string;
    studentName: string;
    studentId: string;
    amount: number;
    type: 'Tuition' | 'Uniform' | 'Transport' | 'Other';
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
    method: 'Mobile Money' | 'Bank Transfer' | 'Cash';
}

export const mockTransactions: Transaction[] = [
    {
        id: 'TXN-001',
        studentName: 'Johnathan Doe',
        studentId: '2023-0041',
        amount: 150000,
        type: 'Tuition',
        date: '2023-10-24',
        status: 'Completed',
        method: 'Mobile Money'
    },
    {
        id: 'TXN-002',
        studentName: 'Sarah Williams',
        studentId: '2023-0099',
        amount: 50000,
        type: 'Uniform',
        date: '2023-10-23',
        status: 'Completed',
        method: 'Cash'
    },
    {
        id: 'TXN-003',
        studentName: 'Emily Jane Smith',
        studentId: '2023-0112',
        amount: 150000,
        type: 'Tuition',
        date: '2023-10-22',
        status: 'Pending',
        method: 'Bank Transfer'
    },
    {
        id: 'TXN-004',
        studentName: 'Robert Brown',
        studentId: '2022-0492',
        amount: 30000,
        type: 'Transport',
        date: '2023-10-21',
        status: 'Failed',
        method: 'Mobile Money'
    },
    {
        id: 'TXN-005',
        studentName: 'Michael Ndayishimiye',
        studentId: '2023-0201',
        amount: 150000,
        type: 'Tuition',
        date: '2023-10-20',
        status: 'Completed',
        method: 'Bank Transfer'
    }
];

export const financeStats = {
    totalRevenue: 45000000,
    outstandingFees: 12500000,
    expenses: 18000000,
    netIncome: 27000000
};
