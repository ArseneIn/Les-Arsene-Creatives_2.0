/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises */
import { DataSource } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Batch } from './entities/batch.entity';
import { Sale } from './entities/sale.entity';
import { DebtLedger } from './entities/debt-ledger.entity';
import { User, UserRole } from './entities/user.entity';
import { Expense } from './entities/expense.entity';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1',
  database: process.env.DB_NAME || 'smart_curuza',
  entities: [
    Merchant,
    Product,
    Customer,
    Batch,
    Sale,
    DebtLedger,
    User,
    Expense,
  ],
  synchronize: true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const merchantRepo = AppDataSource.getRepository(Merchant);
    const userRepo = AppDataSource.getRepository(User);

    // 1. Create Super Admin
    const adminEmail = 'admin@smartcuruza.com';
    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      console.log('Creating Super Admin...');
      adminUser = userRepo.create({
        email: adminEmail,
        name: 'Super Admin',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.SUPERADMIN,
      });
      await userRepo.save(adminUser);
    } else {
      console.log('Super Admin already exists.');
      adminUser.role = UserRole.SUPERADMIN;
      await userRepo.save(adminUser);
    }

    // 2. Create Merchant "Murokore shop"
    let merchant = await merchantRepo.findOne({
      where: { business_name: 'Murokore shop' },
    });
    if (!merchant) {
      console.log('Creating Murokore shop...');
      merchant = merchantRepo.create({
        business_name: 'Murokore shop',
        device_id: 'DEVICE-MUROKORE',
        subscription_status: 'ACTIVE',
        address: 'Kigali, Rwanda',
        phone: '+250 788 111 222',
      });
      await merchantRepo.save(merchant);
    } else {
      console.log('Murokore shop already exists.');
    }

    // 3. Create Owner "Kalisa"
    let kalisa = await userRepo.findOne({
      where: { email: 'kalisa@smartcuruza.com' },
    });
    if (!kalisa) {
      console.log('Creating Kalisa...');
      kalisa = userRepo.create({
        name: 'Kalisa',
        email: 'kalisa@smartcuruza.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MERCHANT,
        merchant: merchant,
      });
      await userRepo.save(kalisa);
    } else {
      console.log('Kalisa already exists.');
      kalisa.merchant = merchant;
      kalisa.role = UserRole.MERCHANT;
      await userRepo.save(kalisa);
    }

    // Link merchant to owner
    merchant.owner = kalisa;
    await merchantRepo.save(merchant);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
