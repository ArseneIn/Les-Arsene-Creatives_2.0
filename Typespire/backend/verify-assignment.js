// const axios = require('axios'); // Removed to use fetch

const API_URL = 'http://localhost:3000/api/v1';

async function verifyAssignment() {
    try {
        console.log('Starting verification...');

        // 1. Create Institution (or use existing if possible, but creating is safer for isolation)
        // For simplicity, we might need to login as super admin first to create institution?
        // Or we can just try to create a user and section if we have seed data.
        // Let's assume we can create a user and section directly or use existing ones if we knew IDs.
        // Since we don't know IDs, let's try to create a facilitator first.

        // Actually, to create a facilitator we need an institution. 
        // Let's rely on the fact that the app is running and maybe we can just hit the endpoint if we had IDs.
        // But we don't.

        // Let's try to find an existing institution first.
        // This script might be complex to run without a proper seed or auth token.
        // Let's try to use the Prisma Client directly in the script to setup data, then call API.

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // Create dummy data directly in DB
        const institution = await prisma.institution.create({
            data: {
                name: 'Test Inst Assignment',
                slug: 'test-inst-assign-' + Date.now(),
            }
        });
        console.log('Institution created:', institution.id);

        const facilitator = await prisma.user.create({
            data: {
                email: 'facilitator-' + Date.now() + '@test.com',
                password: 'password',
                role: 'FACILITATOR',
                institutionId: institution.id,
            }
        });
        console.log('Facilitator created:', facilitator.id);

        const intake = await prisma.intake.create({
            data: {
                name: 'Test Intake',
                startDate: new Date(),
                institutionId: institution.id,
                status: 'ACTIVE'
            }
        });

        const section = await prisma.section.create({
            data: {
                name: 'Test Section',
                intakeId: intake.id,
            }
        });
        console.log('Section created:', section.id);

        // Now call the API to assign
        console.log('Calling API to assign facilitator...');
        try {
            const response = await fetch(`${API_URL}/section/${section.id}/assign-facilitator`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    facilitatorId: facilitator.id
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed with status ${response.status}: ${errorText}`);
            }

            console.log('API call successful');
        } catch (error) {
            console.error('API call failed:', error.message);
            throw error;
        }

        // Verify in DB
        const updatedSection = await prisma.section.findUnique({
            where: { id: section.id }
        });

        if (updatedSection.facilitatorId === facilitator.id) {
            console.log('SUCCESS: Facilitator assigned correctly.');
        } else {
            console.error('FAILURE: Facilitator NOT assigned.');
        }

        // Cleanup
        await prisma.section.delete({ where: { id: section.id } });
        await prisma.intake.delete({ where: { id: intake.id } });
        await prisma.user.delete({ where: { id: facilitator.id } });
        await prisma.institution.delete({ where: { id: institution.id } });
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyAssignment();
