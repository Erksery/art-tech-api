import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = `./${process.env.UPLOAD_FOLDER}`;
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

  app.enableCors({
    origin: process.env.DEV_URL,
    credentials: true,
  });
  await app.listen(process.env.DEV_PORT ?? 3000);
  console.log(`http://localhost:${process.env.DEV_PORT}`);
}

bootstrap();
