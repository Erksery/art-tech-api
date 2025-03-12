import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'src/models/file.model';
import { findAllFiles } from './utils/findAllFiles';
import { Request } from 'express';
import { findOneFile } from './utils/findOneFile';
import { handleFileUpload } from './utils/fileUpload';
import { editFile } from './utils/editFile';
import { deleteFile } from './utils/deleteFile';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileModel: typeof File) {}

  async findAll(folderId: string, req: Request) {
    return await findAllFiles(this.fileModel, folderId);
  }

  async findOne(fileId: string, req: Request) {
    return await findOneFile(this.fileModel, fileId);
  }

  async fileUpload(folderId: string, file, req: Request) {
    return await handleFileUpload(this.fileModel, file, folderId, req.user);
  }

  async edit(fileId: string, data, req: Request) {
    return await editFile(this.fileModel, fileId, data);
  }

  async delete(fileId: string, req: Request) {
    return await deleteFile(this.fileModel, fileId);
  }
}
