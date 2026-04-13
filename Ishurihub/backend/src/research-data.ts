import { DataSource, IsNull } from 'typeorm';
import { User } from './users/entities/user.entity';
import { School } from './schools/entities/school.entity';
import { Role } from './roles/entities/role.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function research() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1',
    database: process.env.DB_NAME || 'ishurihub',
    entities: [User, School, Role],
  });

  await dataSource.initialize();

  const schoolRepo = dataSource.getRepository(School);
  const userRepo = dataSource.getRepository(User);

  const schools = await schoolRepo.find();
  const unassignedUsers = await userRepo.find({
    where: { schoolId: IsNull() },
  });

  console.log('--- SCHOOLS ---');
  schools.forEach((s) => console.log(`ID: ${s.id}, Name: ${s.name}`));

  console.log('\n--- UNASSIGNED USERS ---');
  unassignedUsers.forEach((u) =>
    console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.roleId}`),
  );

  if (unassignedUsers.length > 0 && schools.length > 0) {
    const defaultSchool = schools[0];
    console.log(
      `\nAssigning ${unassignedUsers.length} users to school: ${defaultSchool.name} (${defaultSchool.id})`,
    );

    for (const user of unassignedUsers) {
      user.schoolId = defaultSchool.id;
      await userRepo.save(user);
      console.log(`Updated user: ${user.email}`);
    }
  } else if (unassignedUsers.length > 0) {
    console.log(
      '\nFound unassigned users but no schools exist to assign them to.',
    );
  } else {
    console.log('\nAll users are currently assigned to a school.');
  }

  await dataSource.destroy();
}

research().catch(console.error);
