import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from 'src/models/folder.model';
import { getFolders } from './utils/getFolders';
import { createFolder } from './utils/createFolder';
import { editFolder } from './utils/editFolder';
import { deleteFolder } from './utils/deleteFolder';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder) private folderModel: typeof Folder,
    @InjectModel(File) private fileModel: typeof File,
  ) {}

  async get(req) {
    return await getFolders(this.folderModel, req.user);
  }
  async create(folderId: string | null, data, req) {
    return await createFolder(this.folderModel, folderId, data, req.user);
  }
  async edit(folderId: string, data) {
    return await editFolder(this.folderModel, folderId, data);
  }
  async delete(folderId: string) {
    return await deleteFolder(this.folderModel, folderId);
  }
}
