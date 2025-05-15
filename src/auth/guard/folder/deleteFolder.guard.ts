import { ROLE_VALUES } from 'src/config/constants.config';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class DeleteFolderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.params.folderId;

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

    if (user.role === ROLE_VALUES.ADMIN) {
      return true;
    }

    if (user.id !== folder.creator) {
      throw new ForbiddenException('Удалять папку может только ее создатель');
    }

    return true;
  }
}
