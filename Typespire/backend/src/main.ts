import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:5173',
    'http://192.168.0.84:5173',
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  allowedOrigins.push(/https:\/\/.*\.vercel\.app$/);

  // Enable CORS
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Set Global Prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
