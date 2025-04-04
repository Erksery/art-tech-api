import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'src/models/file.model';
import { findAllFiles } from './utils/findAllFiles';
import { Request } from 'express';
import { findOneFile } from './utils/findOneFile';
import { handleFileUpload } from './utils/fileUpload';
import { editFile } from './utils/editFile';
import { deleteFile } from './utils/deleteFile';
import { getFileContent } from './utils/getFilePath';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileModel: typeof File) {}

  async findAll(folderId: string, order?: string, filter?: string) {
    return await findAllFiles(this.fileModel, folderId, order, filter);
  }

  async findOne(fileId: string, req: Request) {
    return await findOneFile(this.fileModel, fileId);
  }

  async getFilePath(fileName: string, req: Request) {
    return await getFileContent(this.fileModel, fileName);
  }

  async fileUpload(
    folderId: string,
    fileName: string,
    originalName: string,
    file,
    req: Request,
  ) {
    return await handleFileUpload(
      this.fileModel,
      folderId,
      fileName,
      originalName,
      file,
      req.user,
    );
  }

  async edit(fileId: string, data, req: Request) {
    return await editFile(this.fileModel, fileId, data);
  }

  async delete(fileId: string, req: Request) {
    return await deleteFile(this.fileModel, fileId);
  }
}
