/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

let app: INestApplication;

// VERCEL SERVERLESS HANDLER
export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!app) {
      app = await NestFactory.create(AppModule);
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      await app.init();
    }

    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error: any) {
    console.error('CRITICAL NESTJS STARTUP ERROR:', error);
    res.status(500).json({
      error: 'Backend Crash',
      message: error.message || String(error),
      stack: error.stack,
    });
  }
}

// LOCAL DEVELOPMENT BOOTSTRAP
if (!process.env.VERCEL) {
  async function bootstrap() {
    const localApp = await NestFactory.create(AppModule);
    localApp.enableCors({
      origin: true,
      credentials: true,
    });

    localApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = process.env.PORT ?? 3001;
    await localApp.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${port}`);
  }
  bootstrap();
}
