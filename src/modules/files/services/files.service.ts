import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from 'src/models/file.model';
import { Request } from 'express';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileModel: typeof File) {}

  async findAll(id: string, req: Request) {}

  async findOne(id: string, req: Request) {}

  async create(id: string, file: File, req: Request) {}

  async edit(id: string, data, req: Request) {}

  async delete(id: string, req: Request) {}
}
