import { DataSource } from 'typeorm';
import { School } from './schools/entities/school.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const ALL_FEATURES = [
  'academic-core',
  'attendance',
  'timetable',
  'discipline',
  'library',
  'finance',
  'holiday-lms',
  'events',
  'support',
];

async function enableFeatures() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1',
    database: process.env.DB_NAME || 'ishurihub',
    entities: [School],
  });

  await dataSource.initialize();
  const schoolRepo = dataSource.getRepository(School);
  const schools = await schoolRepo.find();

  console.log(`Found ${schools.length} school(s). Enabling all features...`);

  for (const school of schools) {
    const before = school.features;
    school.features = ALL_FEATURES;
    await schoolRepo.save(school);
    console.log(`✅ ${school.name}: ${JSON.stringify(before)} → ${JSON.stringify(school.features)}`);
  }

  await dataSource.destroy();
  console.log('\nDone! All schools now have all features enabled.');
}

enableFeatures().catch(console.error);
