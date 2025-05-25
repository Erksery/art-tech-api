import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'src/models/file.model';
import { findAllFiles } from './utils/findAllFiles';
import { Request } from 'express';
import { findOneFile } from './utils/findOneFile';
import { createFile } from './utils/createFile';
import { editFile } from './utils/editFile';
import { deleteFile, deleteFiles } from './utils/deleteFile';
import { getFileContent } from './utils/getFilePath';
import { searchAllFiles } from './utils/searchAllFiles';
import { Folder } from 'src/models/folder.model';
import { uploadFile } from './utils/uploadFile';
import { findVideoFile } from './utils/findVideoFile';
import { pasteFile } from './utils/copyFile';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File) private fileModel: typeof File,
    @InjectModel(Folder) private folderModel: typeof Folder,
  ) {}

  async findAll(
    folderId: string,
    order?: string,
    filter?: string,
    search?: string,
  ) {
    return await findAllFiles(this.fileModel, folderId, order, filter, search);
  }

  async findOne(fileId: string) {
    return await findOneFile(this.fileModel, fileId);
  }

  async searchAllFiles(
    folderId: string,
    searchValue: string,
    location: string,
    req: Request,
  ) {
    return await searchAllFiles(
      this.fileModel,
      this.folderModel,
      folderId,
      searchValue,
      location,
      req,
    );
  }

  async getFilePath(fileName: string, req: Request) {
    return await getFileContent(this.fileModel, fileName);
  }

  async getVideo(req, res, fileName: string) {
    return await findVideoFile(req, res, fileName);
  }

  async edit(fileId: string, data, req: Request) {
    return await editFile(this.fileModel, fileId, data);
  }

  async deleteOne(fileId: string, req: Request) {
    return await deleteFile(this.fileModel, fileId);
  }

  async deleteMultiple(filesId: string[], req: Request) {
    return await deleteFiles(this.fileModel, filesId);
  }

  async upload(folderId: string, req: Request, res: Response) {
    return await uploadFile(this.fileModel, folderId, req, res);
  }

  async paste(files: string[], folderId: string) {
    return await pasteFile(this.fileModel, files, folderId);
  }
}
