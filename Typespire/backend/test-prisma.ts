import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Prisma Client instantiated successfully');
    await prisma.$disconnect();
}

main().catch(console.error);
