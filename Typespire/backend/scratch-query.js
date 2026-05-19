const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      section: true
    }
  });
  console.log('--- USERS IN DATABASE ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.firstName} ${u.lastName} | Role: ${u.role} | Section: ${u.section ? u.section.name : 'NONE'} (ID: ${u.sectionId})`);
  });

  const assignments = await prisma.assignment.findMany({
    include: {
      section: true
    }
  });
  console.log('\n--- ASSIGNMENTS IN DATABASE ---');
  assignments.forEach(a => {
    console.log(`ID: ${a.id} | Title: ${a.title} | Status: ${a.status} | Section: ${a.section ? a.section.name : 'NONE'} (ID: ${a.sectionId})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
