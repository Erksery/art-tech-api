import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PRIVACY_VALUES } from 'src/config/constants.config';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class FindGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.params.folderId;

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует индификатор папки`);
    }

    const parentFolder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['privacy', 'creator'],
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

    if (parentFolder.privacy === PRIVACY_VALUES.PUBLIC) {
      return true;
    }

    throw new ForbiddenException('У вас нет доступа к этой папке');
  }
}
