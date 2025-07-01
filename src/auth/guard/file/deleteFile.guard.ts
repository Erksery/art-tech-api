import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  PRIVACY_VALUES,
  ROLE_VALUES,
  SHARING_VALUES
} from 'src/config/constants.config'
import { Folder } from 'src/models/folder.model'

@Injectable()
export class DeleteFileGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const folderId = request.params.folderId

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует идентификатор папки`)
    }

    const folder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['creator', 'privacy', 'sharingOptions']
    })

    if (!folder) {
      throw new ForbiddenException(`Родительская папка ${folderId} не найдена`)
    }

    if (user.id === folder.creator) {
      return true
    }
    if (user.role === ROLE_VALUES.ADMIN) {
      return true
    }

    if (folder.privacy === PRIVACY_VALUES.PRIVATE) {
      throw new ForbiddenException(
        'Доступ к родительской папке запрещен сторонним лицам'
      )
    }

    if (
      folder.privacy === PRIVACY_VALUES.PUBLIC &&
      folder.sharingOptions === SHARING_VALUES.EDITING
    ) {
      return true
    }

    throw new ForbiddenException('Недостаточно прав для удаления файла')
  }
}
