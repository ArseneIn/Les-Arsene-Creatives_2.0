import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1',
  database: process.env.DB_NAME || 'smart_curuza',
  synchronize: false, // Important: Do not sync automatically
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function fixDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for fixing...');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    const columnsToFix = [
      {
        name: 'batch_number',
        type: 'character varying',
        default: `'BATCH-' || "id"`,
      },
      { name: 'original_quantity', type: 'decimal(10,2)', default: '0' },
      { name: 'current_quantity', type: 'decimal(10,2)', default: '0' },
      { name: 'buying_price_per_unit', type: 'decimal(10,2)', default: '0' },
      { name: 'status', type: 'character varying', default: `'active'` },
      { name: 'product_id', type: 'uuid', default: null }, // Special handling
    ];

    for (const col of columnsToFix) {
      const hasColumn = await queryRunner.hasColumn('batches', col.name);
      if (!hasColumn) {
        console.log(`Adding missing column ${col.name}...`);
        await queryRunner.query(
          `ALTER TABLE "batches" ADD COLUMN "${col.name}" ${col.type}`,
        );
      }

      console.log(`Populating ${col.name}...`);
      if (col.name === 'product_id') {
        // Only update if null
        await queryRunner.query(
          `UPDATE "batches" SET "product_id" = (SELECT id FROM products LIMIT 1) WHERE "product_id" IS NULL`,
        );
      } else {
        await queryRunner.query(
          `UPDATE "batches" SET "${col.name}" = ${col.default} WHERE "${col.name}" IS NULL`,
        );
      }

      console.log(`Setting ${col.name} to NOT NULL...`);
      await queryRunner.query(
        `ALTER TABLE "batches" ALTER COLUMN "${col.name}" SET NOT NULL`,
      );
    }

    console.log('Database fix complete!');
    await queryRunner.release();
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

void fixDatabase();
