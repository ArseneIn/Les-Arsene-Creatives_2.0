import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.user.updateMany({
        where: { firstName: 'Mary', lastName: 'Jane' },
        data: { firstName: 'Sophia', lastName: 'Martinez' }
    });
    console.log(`Updated ${result.count} Mary Janes.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
