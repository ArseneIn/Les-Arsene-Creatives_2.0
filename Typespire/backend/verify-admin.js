require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for admin user...');
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@typespire.com' },
    });

    if (!admin) {
        console.log('❌ Admin user NOT found in database.');
        return;
    }

    console.log('✅ Admin user found:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        passwordHash: admin.password.substring(0, 10) + '...',
    });

    const isMatch = await bcrypt.compare('password123', admin.password);
    console.log(`Password 'password123' match: ${isMatch ? '✅ YES' : '❌ NO'}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
