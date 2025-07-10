import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FilesController } from './controllers/files.controller'
import { FilesService } from './services/files.service'
import { File } from 'src/models/file.model'
import { AuthModule } from 'src/auth/auth.module'
import { UploadController } from './controllers/upload.controller'
import { Folder } from 'src/models/folder.model'
import { PublicFilesController } from './controllers/public.files.controller'
import { Trash } from 'src/models/trash.model'

@Module({
  imports: [SequelizeModule.forFeature([File, Folder, Trash]), AuthModule],
  providers: [FilesService],
  controllers: [FilesController, UploadController, PublicFilesController]
})
export class FilesModule {}
