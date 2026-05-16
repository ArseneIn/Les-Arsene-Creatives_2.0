import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientManagementModule } from './client-management/client-management.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchesModule } from './batches/batches.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MerchantsModule } from './merchants/merchants.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ExpensesModule } from './expenses/expenses.module';
import { TaxModule } from './tax/tax.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { EbmModule } from './ebm/ebm.module';
import { ShiftsModule } from './shifts/shifts.module';

const imports: any[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const databaseUrl = configService.get<string>('DATABASE_URL');
      return {
        type: 'postgres',
        ...(databaseUrl
          ? { url: databaseUrl }
          : {
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
            }),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl:
          configService.get<string>('DB_SSL') === 'true' || databaseUrl
            ? { rejectUnauthorized: false }
            : false,
      };
    },
    inject: [ConfigService],
  }),
  ClientManagementModule,
  ProductsModule,
  SalesModule,
  AuthModule,
  BatchesModule,
  PaymentsModule,
  DashboardModule,
  MerchantsModule,
  NotificationsModule,
  ExpensesModule,
  TaxModule,
  SuperAdminModule,
  EbmModule,
  ShiftsModule,
];

// We are completely disabling ServeStaticModule for now to ensure it
// is not causing the Serverless Lambda cold-start crash.
/*
if (!process.env.VERCEL) {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  );
}
*/

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
