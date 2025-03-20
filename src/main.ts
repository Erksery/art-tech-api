import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

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
    origin: ['http://192.168.1.212:5173'],
    credentials: true,
  });

  await app.listen(process.env.DEV_PORT ?? 3000);
  console.log(`http://localhost:${process.env.DEV_PORT}`);
}

bootstrap();
