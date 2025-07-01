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
export class EditFolderGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const folderId = request.params.folderId
    const body = request.body

    console.log(folderId, body)

    if (!folderId) {
      throw new ForbiddenException(`Отсутствует индификатор папки`)
    }

    const folder = await Folder.findOne({
      where: { id: folderId },
      attributes: ['privacy', 'creator', 'sharingOptions']
    })

    if (!folder) {
      throw new ForbiddenException(`Папка ${folderId} не найдена`)
    }

    if (user.id === folder.creator) {
      return true
    }

    if (user.role === ROLE_VALUES.ADMIN) {
      return true
    }

    if (folder.privacy === PRIVACY_VALUES.PRIVATE) {
      throw new ForbiddenException(
        'Доступ к этой папке запрещен сторонним лицам'
      )
    }

    if ('sharingOptions' in body && user.id !== folder.creator) {
      throw new ForbiddenException(
        'Только создатель папки может изменять настройки доступа'
      )
    }

    if ('privacy' in body && user.id !== folder.creator) {
      throw new ForbiddenException(
        'Только создатель папки может изменять приватность папки'
      )
    }

    throw new ForbiddenException('Недостаточно прав для выполнения операции')
  }
}
