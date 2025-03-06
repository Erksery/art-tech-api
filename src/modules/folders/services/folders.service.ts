import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folders } from 'src/models/folders.model';
import { getFolders } from './utils/getFolders';

@Injectable()
export class FolderService {
  constructor(@InjectModel(Folders) private folderModel: typeof Folders) {}

  async get(id: string) {
    return getFolders(id);
  }
  async create(id: string) {}
  async edit(id: string) {}
  async delete(id: string) {}
}
