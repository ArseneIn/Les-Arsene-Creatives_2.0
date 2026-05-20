import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding dummy students and test results...");

    // 1. Find all facilitators
    const facilitators = await prisma.user.findMany({
        where: { role: 'FACILITATOR' },
        include: {
            facilitatedSections: true
        }
    });

    if (facilitators.length === 0) {
        console.log("No facilitators found. Creating a default facilitator.");
        // We'll just exit and tell the user they need a facilitator first
        return;
    }

    const defaultPassword = await bcrypt.hash('Password123!', 10);

    for (const facilitator of facilitators) {
        console.log(`Processing Facilitator: ${facilitator.firstName} ${facilitator.lastName}`);
        
        let sections = facilitator.facilitatedSections;
        
        // If facilitator has no sections, we need an intake and an institution to make a section
        if (sections.length === 0) {
            console.log(`Facilitator ${facilitator.id} has no sections. Let's create one.`);
            
            // Create a default Intake if none exists
            let intake = await prisma.intake.findFirst({ where: { institutionId: facilitator.institutionId! }});
            if (!intake) {
                intake = await prisma.intake.create({
                    data: {
                        name: 'Spring 2026',
                        startDate: new Date(),
                        institutionId: facilitator.institutionId!,
                    }
                });
            }

            const section = await prisma.section.create({
                data: {
                    name: 'Web Dev Section A',
                    intakeId: intake.id,
                    facilitatorId: facilitator.id,
                }
            });
            sections = [section];
        }

        for (const section of sections) {
            console.log(`- Seeding section: ${section.name}`);

            // Ensure an assignment exists for this section
            let assignment = await prisma.assignment.findFirst({
                where: { sectionId: section.id }
            });

            let test;
            if (!assignment) {
                test = await prisma.test.create({
                    data: {
                        title: 'Typing Fundamentals Exam',
                        content: 'This is a formal test to measure your typing speed and accuracy. Do your best!',
                        duration: 60,
                        difficulty: 'MEDIUM',
                    }
                });

                assignment = await prisma.assignment.create({
                    data: {
                        title: 'Week 1 Assessment',
                        dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
                        sectionId: section.id,
                        testId: test.id,
                        status: 'ACTIVE'
                    }
                });
            } else {
                test = await prisma.test.findUnique({ where: { id: assignment.testId! } });
            }

            // Create 3 seed students
            for (let i = 1; i <= 3; i++) {
                const randomId = Math.floor(Math.random() * 10000);
                const student = await prisma.user.create({
                    data: {
                        email: `student${randomId}@example.com`,
                        username: `student_${randomId}`,
                        password: defaultPassword,
                        firstName: `Seed`,
                        lastName: `Student ${i}`,
                        role: 'STUDENT',
                        institutionId: facilitator.institutionId,
                        sectionId: section.id,
                    }
                });

                console.log(`  Created student: ${student.email}`);

                // Give them 3 formal test results for this assignment
                for (let j = 0; j < 3; j++) {
                    // Random WPM between 25 and 75
                    const wpm = Math.floor(Math.random() * 50) + 25;
                    // Random Accuracy between 80 and 100
                    const accuracy = Math.floor(Math.random() * 20) + 80;

                    await prisma.testResult.create({
                        data: {
                            userId: student.id,
                            testId: test!.id,
                            assignmentId: assignment.id,
                            wpm,
                            accuracy,
                            duration: 60,
                            // Spread results out over the past few days
                            createdAt: new Date(new Date().getTime() - (Math.random() * 3 * 24 * 60 * 60 * 1000))
                        }
                    });
                }
            }
        }
    }

    console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
