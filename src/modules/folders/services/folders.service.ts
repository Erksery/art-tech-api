import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folders } from 'src/models/folders.model';
import { getFolders } from './utils/getFolders';
import { createFolder } from './utils/createFolder';
import { editFolder } from './utils/editFolder';
import { deleteFolder } from './utils/deleteFolder';

@Injectable()
export class FolderService {
  constructor(@InjectModel(Folders) private folderModel: typeof Folders) {}

  async get(req) {
    return getFolders(this.folderModel, req.user);
  }
  async create(id: string | null, data, req) {
    return createFolder(this.folderModel, id, data, req.user);
  }
  async edit(id: string, data, req) {
    return editFolder(this.folderModel, id, data);
  }
  async delete(id: string) {
    return deleteFolder(this.folderModel, id);
  }
}
