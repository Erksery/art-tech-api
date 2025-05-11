import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Folder } from 'src/models/folder.model';
import { PRIVACY_VALUES } from 'src/config/constants.config';

@Injectable()
export class PublicFindGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const folderId = request.params.folderId;

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует идентификатор папки`);
    }

    const parentFolder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['privacy'],
    });

    if (!parentFolder) {
      throw new ForbiddenException('Папка не найдена');
    }

    if (parentFolder.privacy !== PRIVACY_VALUES.LINK) {
      throw new ForbiddenException('Эта папка недоступна по ссылке');
    }

    return true;
  }
}
