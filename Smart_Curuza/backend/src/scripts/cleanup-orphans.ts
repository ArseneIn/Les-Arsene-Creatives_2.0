import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SuperAdminService } from '../super-admin/super-admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(SuperAdminService);

  console.log('Cleaning up orphan merchants...');
  try {
    const result = await service.deleteOrphanMerchants();
    console.log(`Deleted ${result.affected} orphan merchants.`);
  } catch (error) {
    console.error('Error cleaning up orphans:', error);
  }

  await app.close();
}
void bootstrap();
