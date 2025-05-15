import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PRIVACY_VALUES,
  ROLE_VALUES,
  SHARING_VALUES,
} from 'src/config/constants.config';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class EditFileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private canEditFolder(folder: Folder, userId: string, user): boolean {
    if (folder.creator === userId) return true;

    if (user.role === ROLE_VALUES.ADMIN) {
      return true;
    }

    if (
      folder.privacy === PRIVACY_VALUES.PUBLIC &&
      folder.sharingOptions === SHARING_VALUES.EDITING
    ) {
      return true;
    }

    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.params.folderId;
    const targetFolderId = request.body?.editData?.folderId;

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует идентификатор исходной папки`);
    }

    const sourceFolder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['privacy', 'creator', 'sharingOptions'],
    });

    if (!sourceFolder) {
      throw new ForbiddenException(`Папка ${folderId} не найдена`);
    }

    if (targetFolderId) {
      const targetFolder = await Folder.findOne({
        where: { id: targetFolderId },
        attributes: ['privacy', 'creator', 'sharingOptions'],
      });

      if (!targetFolder) {
        throw new ForbiddenException(
          `Целевая папка ${targetFolderId} не найдена`,
        );
      }

      if (!this.canEditFolder(targetFolder, user.id, user)) {
        throw new ForbiddenException(
          `Недостаточно прав для перемещения файла в целевую папку`,
        );
      }
    }

    if (!this.canEditFolder(sourceFolder, user.id, user)) {
      throw new ForbiddenException(
        `Недостаточно прав для редактирования файла в исходной папке`,
      );
    }

    return true;
  }
}
