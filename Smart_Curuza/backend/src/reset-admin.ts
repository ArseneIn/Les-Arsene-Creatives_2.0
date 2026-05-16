/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, prefer-const */
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Merchant } from './entities/merchant.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Batch } from './entities/batch.entity';
import { Sale } from './entities/sale.entity';
import { DebtLedger } from './entities/debt-ledger.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1',
  database: process.env.DB_NAME || 'smart_curuza',
  entities: [Merchant, Product, Customer, Batch, Sale, DebtLedger, User],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function resetAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected...');

    const userRepo = AppDataSource.getRepository(User);
    const adminEmail = 'admin@smartcuruza.com';

    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });

    if (adminUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      adminUser.password = hashedPassword;
      await userRepo.save(adminUser);
      console.log(`Password for ${adminEmail} has been reset to: password123`);
    } else {
      console.log('Admin user not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAdmin();
