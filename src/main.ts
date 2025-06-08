import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  await ConfigModule.forRoot();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:4173',
      'http://localhost:5173',
      'http://192.168.0.3:5173',
      'http://192.168.137.1:5173',
    ],
    credentials: true,
  });

  await app.listen(process.env.DEV_PORT ?? 3000);
  console.log(`http://localhost:${process.env.DEV_PORT}`);
}

bootstrap();
