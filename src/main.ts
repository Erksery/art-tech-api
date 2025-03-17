import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import * as cookieParser from 'cookie-parser';

const uploadDir = `./${process.env.UPLOAD_FOLDER || 'uploads'}`;
if (uploadDir !== undefined && !existsSync(uploadDir)) {
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
    origin: ['http://192.168.0.3:5173'],
    credentials: true,
  });

  await app.listen(process.env.DEV_PORT ?? 3000);
  console.log(`http://localhost:${process.env.DEV_PORT}`);
}

bootstrap();
