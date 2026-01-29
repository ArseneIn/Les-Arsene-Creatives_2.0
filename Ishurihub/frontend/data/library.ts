export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    coverUrl: string;
}

export interface LibraryTransaction {
    id: string;
    bookId: string;
    studentId: string;
    studentName: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'Borrowed' | 'Returned' | 'Overdue';
}

export const mockBooks: Book[] = [
    {
        id: 'b1',
        title: 'Introduction to Physics',
        author: 'John Doe',
        isbn: '978-3-16-148410-0',
        category: 'Science',
        totalCopies: 50,
        availableCopies: 32,
        coverUrl: 'https://placehold.co/400x600/1e3a8a/ffffff?text=Physics'
    },
    {
        id: 'b2',
        title: 'Advanced Mathematics',
        author: 'Jane Smith',
        isbn: '978-1-23-456789-7',
        category: 'Mathematics',
        totalCopies: 40,
        availableCopies: 5,
        coverUrl: 'https://placehold.co/400x600/1e40af/ffffff?text=Math'
    },
    {
        id: 'b3',
        title: 'World History',
        author: 'David Wilson',
        isbn: '978-0-12-345678-9',
        category: 'History',
        totalCopies: 30,
        availableCopies: 28,
        coverUrl: 'https://placehold.co/400x600/b91c1c/ffffff?text=History'
    },
    {
        id: 'b4',
        title: 'Chemistry 101',
        author: 'Sarah Brown',
        isbn: '978-9-87-654321-0',
        category: 'Science',
        totalCopies: 45,
        availableCopies: 45,
        coverUrl: 'https://placehold.co/400x600/047857/ffffff?text=Chemistry'
    },
    {
        id: 'b5',
        title: 'English Literature',
        author: 'Emily Davis',
        isbn: '978-5-43-210987-6',
        category: 'Literature',
        totalCopies: 60,
        availableCopies: 12,
        coverUrl: 'https://placehold.co/400x600/d97706/ffffff?text=English'
    }
];

export const mockTransactions: LibraryTransaction[] = [
    {
        id: 't1',
        bookId: 'b1',
        studentId: 's1',
        studentName: 'Alice Johnson',
        borrowDate: '2023-10-01',
        dueDate: '2023-10-15',
        status: 'Overdue'
    },
    {
        id: 't2',
        bookId: 'b2',
        studentId: 's2',
        studentName: 'Bob Williams',
        borrowDate: '2023-10-10',
        dueDate: '2023-10-24',
        status: 'Borrowed'
    },
    {
        id: 't3',
        bookId: 'b5',
        studentId: 's3',
        studentName: 'Charlie Brown',
        borrowDate: '2023-10-12',
        dueDate: '2023-10-26',
        status: 'Borrowed'
    }
];
