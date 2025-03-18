import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './modules/files/files.module';
import { UserModule } from './modules/users/user.module';
import { FoldersModule } from './modules/folders/folders.module';
import { sequelizeConfig } from './config/sequlize.config';
import { AuthModule } from './auth/auth.module';
import { extname, join } from 'path';
import * as multer from 'multer';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = join(__dirname, '..', 'uploads');
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
    FilesModule,
    UserModule,
    AuthModule,
    FoldersModule,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}
