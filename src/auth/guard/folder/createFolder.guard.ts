import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRIVACY_VALUES } from 'src/config/constants.config';
import { Folders } from 'src/models/folders.model';

@Injectable()
export class CreateFolderGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.query.id;

    if (!folderId) {
      return true;
    }

    const parentFolder = await Folders.findOne({
      where: { id: folderId },
      attributes: ['privacy', 'creator'],
    });

    if (!parentFolder) {
      throw new ForbiddenException('Родительская папка не найдена');
    }

    if (
      parentFolder.privacy !== PRIVACY_VALUES.PUBLIC &&
      user.id !== parentFolder.creator
    ) {
      throw new ForbiddenException('Недостаточно прав для создания папки');
    }

    return true;
  }
}
