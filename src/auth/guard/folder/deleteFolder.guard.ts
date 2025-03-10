import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRIVACY_VALUES, SHARING_VALUES } from 'src/config/constants.config';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class DeleteFolderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.query.id;

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует идентификатор папки`);
    }

    const folder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['creator'],
    });

    if (!folder) {
      throw new ForbiddenException(`Папка ${folderId} не найдена`);
    }

    if (user.id !== folder.creator) {
      throw new ForbiddenException('Удалять папку может только ее создатель');
    }

    return true;
  }
}
