export const mockMerchants = [
    { id: '1', name: 'Kigali Provisions', owner: 'Jean Paul', location: 'Nyamirambo', status: 'Active' },
    { id: '2', name: 'Mama Fils Shop', owner: 'Marie Claire', location: 'Kimironko', status: 'Locked' },
    { id: '3', name: 'Downtown Electronics', owner: 'David', location: 'CBD', status: 'Active' },
];

export const mockBatches = [
    { id: '101', productName: 'Rice (25kg)', shopName: 'Kigali Provisions', costPrice: 20000, targetRevenue: 25000, currentRevenue: 15000, status: 'Active' },
    { id: '102', productName: 'Sugar (50kg)', shopName: 'Kigali Provisions', costPrice: 45000, targetRevenue: 55000, currentRevenue: 55000, status: 'Closed' },
    { id: '103', productName: 'Cooking Oil (20L)', shopName: 'Mama Fils Shop', costPrice: 30000, targetRevenue: 38000, currentRevenue: 5000, status: 'Active' },
    { id: '104', productName: 'Maize Flour (10kg)', shopName: 'Downtown Electronics', costPrice: 8000, targetRevenue: 12000, currentRevenue: 12500, status: 'Closed' }, // Profit!
];

export const mockDebtors = [
    { id: '201', name: 'Alice Uwase', phone: '0788123456', amount: 5000, dueDate: '2023-11-30' },
    { id: '202', name: 'Eric Mugisha', phone: '0788654321', amount: 12000, dueDate: '2023-11-25' },
];

export const mockTransactions = [
    { id: 'T1', time: '10:30 AM', amount: 5000, method: 'Cash', shop: 'Kigali Provisions' },
    { id: 'T2', time: '10:45 AM', amount: 12000, method: 'MoMo', shop: 'Mama Fils Shop' },
    { id: 'T3', time: '11:15 AM', amount: 2500, method: 'Credit', shop: 'Kigali Provisions' },
];
