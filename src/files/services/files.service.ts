import { Injectable } from '@nestjs/common';
import { File } from '../interfaces/File.interface';
import { createFile } from './dto/create-file.dto';

export function findAllFiles(files: File[]): File[] {
  return files;
}

export function findOneFile(id: string, files: File[]) {
  const file = files.find((file) => file.id === id);
  return { file };
}

@Injectable()
export class FilesService {
  private files: File[] = [
    { id: '1', name: 'sds' },
    { id: '2', name: 'sdadads' },
  ];

  create(file: File) {
    this.files = createFile(this.files, file);
  }

  findOne(id: string) {
    return findOneFile(id, this.files);
  }

  findAll(): File[] {
    return findAllFiles(this.files);
  }
}
