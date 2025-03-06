import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { Folders } from 'src/models/folders.model';
import { FolderController } from './controllers/folders.controller';

@Module({
  imports: [SequelizeModule.forFeature([Folders])],
  controllers: [FolderController],
})
export class FoldersModule {}
