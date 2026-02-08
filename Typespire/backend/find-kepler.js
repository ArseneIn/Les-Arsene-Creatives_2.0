
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@keplercollege.ac.rw' },
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    const isMatch = await bcrypt.compare('password123', user.password);
    console.log(`User: ${user.email}`);
    console.log(`Password 'password123' match: ${isMatch ? '✅ YES' : '❌ NO'}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
