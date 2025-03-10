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
export class CreateFileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.params.folderId;

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует индификатор папки`);
    }

    const parentFolder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['privacy', 'creator', 'sharingOptions'],
    });

    if (!parentFolder) {
      throw new ForbiddenException('Родительская папка не найдена');
    }

    if (user.id === parentFolder.creator) {
      return true;
    }

    if (parentFolder.privacy === PRIVACY_VALUES.PRIVATE) {
      throw new ForbiddenException(
        'Доступ к этой папке запрещен сторонним лицам',
      );
    }

    if (
      parentFolder.privacy === PRIVACY_VALUES.PUBLIC &&
      parentFolder.sharingOptions === SHARING_VALUES.EDITING
    ) {
      return true;
    }

    throw new ForbiddenException('Недостаточно прав для создания файла');
  }
}
