import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Merchant } from './src/entities/merchant.entity';
import { DataSource } from 'typeorm';

async function checkLatestMerchant() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const merchantRepo = dataSource.getRepository(Merchant);

  const latestMerchant = await merchantRepo.findOne({
    where: {},
    order: { created_at: 'DESC' },
    relations: ['owner'],
  });

  console.log('Latest Merchant:', JSON.stringify(latestMerchant, null, 2));
  await app.close();
}

void checkLatestMerchant();
