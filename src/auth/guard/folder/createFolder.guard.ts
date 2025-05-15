import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  PRIVACY_VALUES,
  ROLE_VALUES,
  SHARING_VALUES,
} from 'src/config/constants.config';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class CreateFolderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.body.folderId;

    if (!folderId) {
      return true;
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

    if (user.role === ROLE_VALUES.ADMIN) {
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

    throw new ForbiddenException('Недостаточно прав для выполнения операции');
  }
}
