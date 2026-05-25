import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const REAL_STUDENTS = [
    {
        first: 'Kevine',
        last: 'Uwera',
        email: 'k.uwera@keplercollege.ac.rw',
        username: 'k_uwera',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 18, accuracy: 88, daysAgo: 6 },
            { testTitle: 'Common Words (Practice)', wpm: 25, accuracy: 92, daysAgo: 4 },
            { testTitle: 'Level 1 Milestone Test', wpm: 28, accuracy: 94, daysAgo: 2 },
            { testTitle: 'Level 2 Milestone Test', wpm: 42, accuracy: 96, daysAgo: 1 }
        ]
    },
    {
        first: 'Jean Bosco',
        last: 'Niyomugabo',
        email: 'jb.niyo@keplercollege.ac.rw',
        username: 'jb_niyo',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 15, accuracy: 80, daysAgo: 7 },
            { testTitle: 'Common Words (Practice)', wpm: 22, accuracy: 85, daysAgo: 5 },
            { testTitle: 'Level 1 Milestone Test', wpm: 26, accuracy: 90, daysAgo: 3 }
        ]
    },
    {
        first: 'Clarisse',
        last: 'Uwineza',
        email: 'c.uwineza@keplercollege.ac.rw',
        username: 'c_uwineza',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 12, accuracy: 78, daysAgo: 5 },
            { testTitle: 'Level 1 Milestone Test', wpm: 16, accuracy: 68, daysAgo: 2 }
        ]
    },
    {
        first: 'Eric',
        last: 'Mugisha',
        email: 'e.mugisha@keplercollege.ac.rw',
        username: 'e_mugisha',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 14, accuracy: 82, daysAgo: 3 }
        ]
    },
    {
        first: 'Divine',
        last: 'Mutoni',
        email: 'd.mutoni@keplercollege.ac.rw',
        username: 'd_mutoni',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 20, accuracy: 90, daysAgo: 8 },
            { testTitle: 'Level 1 Milestone Test', wpm: 32, accuracy: 95, daysAgo: 4 },
            { testTitle: 'Level 2 Milestone Test', wpm: 48, accuracy: 98, daysAgo: 1 }
        ]
    },
    {
        first: 'Patrick',
        last: 'Kwizera',
        email: 'p.kwizera@keplercollege.ac.rw',
        username: 'p_kwizera',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 16, accuracy: 84, daysAgo: 6 },
            { testTitle: 'Level 1 Milestone Test', wpm: 24, accuracy: 88, daysAgo: 2 }
        ]
    },
    {
        first: 'Kevine',
        last: 'Murenzi',
        email: 'k.murenzi@keplercollege.ac.rw',
        username: 'k_murenzi',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 11, accuracy: 80, daysAgo: 4 }
        ]
    },
    {
        first: 'Sandrine',
        last: 'Umutoni',
        email: 's.umutoni@keplercollege.ac.rw',
        username: 's_umutoni',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 13, accuracy: 75, daysAgo: 7 },
            { testTitle: 'Level 1 Milestone Test', wpm: 17, accuracy: 65, daysAgo: 3 }
        ]
    },
    {
        first: 'Gael',
        last: 'Nkurunziza',
        email: 'g.nkurunziza@keplercollege.ac.rw',
        username: 'g_nkurunziza',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 24, accuracy: 92, daysAgo: 9 },
            { testTitle: 'Level 1 Milestone Test', wpm: 36, accuracy: 94, daysAgo: 5 },
            { testTitle: 'Level 2 Milestone Test', wpm: 52, accuracy: 97, daysAgo: 2 }
        ]
    },
    {
        first: 'Ange',
        last: 'Ikirezi',
        email: 'a.ikirezi@keplercollege.ac.rw',
        username: 'a_ikirezi',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 18, accuracy: 86, daysAgo: 6 },
            { testTitle: 'Level 1 Milestone Test', wpm: 28, accuracy: 91, daysAgo: 3 }
        ]
    },
    {
        first: 'Christian',
        last: 'Shema',
        email: 'c.shema@keplercollege.ac.rw',
        username: 'c_shema',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 10, accuracy: 79, daysAgo: 2 }
        ]
    },
    {
        first: 'Marie Grace',
        last: 'Urujeni',
        email: 'mg.urujeni@keplercollege.ac.rw',
        username: 'mg_urujeni',
        history: [
            { testTitle: 'Home Row Drill (Practice)', wpm: 22, accuracy: 88, daysAgo: 5 },
            { testTitle: 'Level 1 Milestone Test', wpm: 30, accuracy: 92, daysAgo: 3 },
            { testTitle: 'Level 2 Milestone Test', wpm: 28, accuracy: 62, daysAgo: 1 }
        ]
    }
];

async function main() {
    console.log("Starting seeding of real Kepler College student performance data...");

    // 1. Delete all existing STUDENT users to clean up dummy seed accounts
    const deleteResults = await prisma.testResult.deleteMany({
        where: {
            user: {
                role: UserRole.STUDENT
            }
        }
    });
    console.log(`Deleted ${deleteResults.count} test results from old students.`);

    const deleteStudents = await prisma.user.deleteMany({
        where: {
            role: UserRole.STUDENT
        }
    });
    console.log(`Deleted ${deleteStudents.count} old student users.`);

    // 2. Find facilitators and their sections
    const facilitators = await prisma.user.findMany({
        where: { role: UserRole.FACILITATOR },
        include: {
            facilitatedSections: true
        }
    });

    if (facilitators.length === 0) {
        console.error("No facilitators found in database. Please run primary seeds first.");
        return;
    }

    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // 3. Make sure our key tests exist
    const testTitles = [
        'Home Row Drill (Practice)',
        'Common Words (Practice)',
        'Level 1 Milestone Test',
        'Level 2 Milestone Test'
    ];

    const testMap: Record<string, any> = {};

    for (const title of testTitles) {
        let test = await prisma.test.findFirst({
            where: { title }
        });

        if (!test) {
            test = await prisma.test.create({
                data: {
                    title,
                    content: `This is the official test content for ${title}. Practice makes perfect!`,
                    duration: 60,
                    difficulty: title.includes('Level 2') ? 'HARD' : title.includes('Level 1') ? 'MEDIUM' : 'EASY'
                }
            });
            console.log(`Created Test: ${title}`);
        }
        testMap[title] = test;
    }

    // 4. Distribute real students between the sections
    let studentIndex = 0;
    for (const facilitator of facilitators) {
        console.log(`\nFacilitator: ${facilitator.firstName} ${facilitator.lastName}`);
        const sections = facilitator.facilitatedSections;

        if (sections.length === 0) {
            console.log(`- Skipping facilitator ${facilitator.id} because they have no sections.`);
            continue;
        }

        for (const section of sections) {
            console.log(`- Seeding Section: ${section.name}`);

            // Take 6 students for this section
            const studentsToSeed = REAL_STUDENTS.slice(studentIndex, studentIndex + 6);
            studentIndex += 6;

            for (const profile of studentsToSeed) {
                // Ensure unique email and username just in case
                const student = await prisma.user.create({
                    data: {
                        email: profile.email,
                        username: profile.username,
                        password: defaultPassword,
                        firstName: profile.first,
                        lastName: profile.last,
                        role: UserRole.STUDENT,
                        institutionId: facilitator.institutionId,
                        sectionId: section.id
                    }
                });
                console.log(`  + Created Student: ${profile.first} ${profile.last} (${profile.email})`);

                // Create test results for their history
                for (const hist of profile.history) {
                    const test = testMap[hist.testTitle];
                    const createdAtDate = new Date();
                    createdAtDate.setDate(createdAtDate.getDate() - hist.daysAgo);

                    await prisma.testResult.create({
                        data: {
                            userId: student.id,
                            testId: test.id,
                            wpm: hist.wpm,
                            accuracy: hist.accuracy,
                            duration: 60,
                            createdAt: createdAtDate
                        }
                    });
                }
                console.log(`    * Seeded ${profile.history.length} test history records.`);
            }
        }
    }

    console.log("\nFinished seeding high-fidelity realistic student performance data successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
