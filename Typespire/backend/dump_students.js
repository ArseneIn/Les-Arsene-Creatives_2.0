const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' }
    });
    console.log(JSON.stringify(students.map(s => ({
        email: s.email,
        username: s.username,
        firstName: s.firstName,
        lastName: s.lastName,
        institutionId: s.institutionId
    })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
