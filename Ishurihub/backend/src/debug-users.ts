import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function check() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1',
    database: process.env.DB_NAME || 'ishurihub',
    entities: [User],
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(User);
  const users = await repo.find();
  console.log('--- DATABASE USERS ---');
  users.forEach((u) => {
    console.log(`- ${u.email} (Role: ${u.roleId})`);
  });
  console.log('----------------------');
  await dataSource.destroy();
}

check().catch(console.error);
