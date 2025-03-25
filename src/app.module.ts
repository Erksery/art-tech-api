import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './modules/files/files.module';
import { UserModule } from './modules/users/user.module';
import { FoldersModule } from './modules/folders/folders.module';
import { sequelizeConfig } from './config/sequlize.config';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    FilesModule,
    UserModule,
    AuthModule,
    FoldersModule,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}
