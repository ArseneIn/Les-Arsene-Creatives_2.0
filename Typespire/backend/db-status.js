const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DATABASE STATUS AUDIT ---');
    try {
        const institutions = await prisma.institution.findMany();
        console.log(`Institutions: ${institutions.length}`);
        for (const inst of institutions) {
            console.log(` - [${inst.id}] Name: ${inst.name}, Slug: ${inst.slug}`);
        }

        const intakes = await prisma.intake.findMany({
            include: {
                sections: {
                    include: {
                        facilitator: true,
                        students: true,
                    }
                }
            }
        });
        console.log(`Intakes: ${intakes.length}`);
        for (const intake of intakes) {
            console.log(` - Intake: ${intake.name} (${intake.status})`);
            for (const sec of intake.sections) {
                console.log(`   * Section: ${sec.name}`);
                console.log(`     Facilitator: ${sec.facilitator ? `${sec.facilitator.firstName} ${sec.facilitator.lastName} (${sec.facilitator.email})` : 'NONE'}`);
                console.log(`     Students Count: ${sec.students.length}`);
                for (const stud of sec.students) {
                    console.log(`       - Student: ${stud.firstName} ${stud.lastName} (Username: ${stud.username}, Email: ${stud.email})`);
                }
            }
        }

        const facilitators = await prisma.user.findMany({
            where: { role: 'FACILITATOR' }
        });
        console.log(`Total Facilitators in system: ${facilitators.length}`);
        for (const f of facilitators) {
            console.log(` - Facilitator: ${f.firstName} ${f.lastName} (${f.email}), ID: ${f.id}`);
        }

        const testResults = await prisma.testResult.findMany({
            include: {
                user: true,
                test: true,
            }
        });
        console.log(`Test Results: ${testResults.length}`);

    } catch (error) {
        console.error('Error running DB status audit:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
