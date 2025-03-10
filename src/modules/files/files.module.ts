import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { File } from 'src/models/file.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([File]), AuthModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
