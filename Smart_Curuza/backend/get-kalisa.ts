import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1',
  database: 'smart_curuza',
  entities: [User],
});

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const kalisa = await repo.findOne({ where: { name: 'Kalisa' } });
  console.log('KALISA RECORD:', kalisa);
  process.exit(0);
}

run();
