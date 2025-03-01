import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequlize.config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    FilesModule,
    UserModule,
    AuthModule,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}
