import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
//import { SequelizeModule } from '@nestjs/sequelize';
//import { sequelizeConfig } from './config/sequlize.config';

@Module({
  imports: [
    FilesModule,
    //SequelizeModule.forRoot(sequelizeConfig)
  ],
})
export class AppModule {}
