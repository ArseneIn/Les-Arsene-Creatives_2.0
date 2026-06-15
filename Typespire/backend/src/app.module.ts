import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { IntakeModule } from './intake/intake.module';
import { SectionModule } from './section/section.module';
import { TestModule } from './test/test.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { AssignmentModule } from './assignment/assignment.module';
import { TestResultModule } from './test-result/test-result.module';
import { BillingModule } from './billing/billing.module';
import { LogsModule } from './logs/logs.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    InstitutionModule,
    IntakeModule,
    SectionModule,
    TestModule,
    AnalyticsModule,
    SettingsModule,
    AssignmentModule,
    TestResultModule,
    BillingModule,
    LogsModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
