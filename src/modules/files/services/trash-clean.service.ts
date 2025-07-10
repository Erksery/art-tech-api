import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Trash } from 'src/models/trash.model'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'
import { TRASH_FOLDER, UPLOAD_FOLDER } from 'src/config/constants.config'
import { File } from 'src/models/file.model'

@Injectable()
export class TrashCleanService {
  constructor(
    @InjectModel(Trash) private trashModel: typeof Trash,
    @InjectModel(File) private fileModel: typeof File
  ) {}

  private readonly logger = new Logger(TrashCleanService.name)

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTrashCleanup() {
    const trashDir = join(process.cwd(), UPLOAD_FOLDER, TRASH_FOLDER)
    const transaction = await this.trashModel.sequelize?.transaction()
    try {
      const deletedTrashCount = await this.trashModel.destroy({
        where: {},
        transaction
      })
      const deletedFileCount = await this.fileModel.destroy({
        where: { isDeleted: true },
        transaction
      })

      await transaction?.commit()
      this.logger.log(
        `Удалено из trash: ${deletedTrashCount}, из files: ${deletedFileCount}`
      )

      if (existsSync(trashDir)) {
        rmSync(trashDir, { recursive: true, force: true })
        this.logger.log('Физическая папка trash удалена')
      }
    } catch (err) {
      this.logger.error('Ошибка при очистке корзины', err)
    }
  }
}
