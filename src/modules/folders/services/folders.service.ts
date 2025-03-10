import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from 'src/models/folder.model';
import { getFolders } from './utils/getFolders';
import { createFolder } from './utils/createFolder';
import { editFolder } from './utils/editFolder';
import { deleteFolder } from './utils/deleteFolder';

@Injectable()
export class FolderService {
  constructor(@InjectModel(Folder) private folderModel: typeof Folder) {}

  async get(req) {
    return await getFolders(this.folderModel, req.user);
  }
  async create(id: string | null, data, req) {
    return await createFolder(this.folderModel, id, data, req.user);
  }
  async edit(id: string, data) {
    return await editFolder(this.folderModel, id, data);
  }
  async delete(id: string) {
    return await deleteFolder(this.folderModel, id);
  }
}
