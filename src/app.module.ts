import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequlize.config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './auth/auth.module';
import { FoldersModule } from './modules/folders/folders.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    FilesModule,
    UserModule,
    AuthModule,
    FoldersModule,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}
