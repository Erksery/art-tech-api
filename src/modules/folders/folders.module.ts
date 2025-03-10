import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Folder } from 'src/models/folder.model';
import { FolderController } from './controllers/folders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FolderService } from './services/folders.service';

@Module({
  imports: [SequelizeModule.forFeature([Folder]), AuthModule],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FoldersModule {}
