import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_NAMES = [
    { first: 'Emma', last: 'Smith' },
    { first: 'Liam', last: 'Johnson' },
    { first: 'Olivia', last: 'Williams' },
    { first: 'Noah', last: 'Brown' },
    { first: 'Ava', last: 'Jones' },
    { first: 'Elijah', last: 'Garcia' },
    { first: 'Sophia', last: 'Miller' },
    { first: 'Lucas', last: 'Davis' },
    { first: 'Isabella', last: 'Rodriguez' },
    { first: 'Mason', last: 'Martinez' },
    { first: 'Mia', last: 'Hernandez' },
    { first: 'Logan', last: 'Lopez' },
];

async function main() {
    const seedStudents = await prisma.user.findMany({
        where: {
            firstName: 'Seed',
            role: 'STUDENT'
        }
    });

    let i = 0;
    for (const student of seedStudents) {
        const name = REAL_NAMES[i % REAL_NAMES.length];
        await prisma.user.update({
            where: { id: student.id },
            data: {
                firstName: name.first,
                lastName: name.last,
            }
        });
        console.log(`Updated ${student.id} to ${name.first} ${name.last}`);
        i++;
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
