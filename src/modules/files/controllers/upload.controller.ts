import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateFileGuard } from 'src/auth/guard/file/createFile.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusConfig } from 'src/config/status.config';
import { existsSync, mkdirSync } from 'fs';
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes';

@Controller(SITE_CONTROLLER.UPLOAD)
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(...RolesConfig.all)
@Status(...StatusConfig.approved)
export class UploadController {
  constructor(private filesService: FilesService) {}

  @Post(SITE_ROUTES.UPLOAD)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file || !file.originalname || !file.mimetype) {
      return { message: 'Файл не загружен или отсутствуют необходимые данные' };
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = join('uploads', fileName);

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      writeStream.write(file.buffer);
      console.log(file);
      writeStream.end();

      writeStream.on('finish', async () => {
        try {
          const savedFile = await this.filesService.fileUpload(
            folderId,
            fileName,
            file,
            req,
          );
          resolve(savedFile);
        } catch (err) {
          console.error('Ошибка при сохранении файла в базе данных:', err);
          reject(
            new HttpException(
              'Ошибка при сохранении файла',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }
      });

      writeStream.on('error', (err) => {
        console.error('Ошибка при записи файла:', err);
        reject(
          new HttpException(
            'Ошибка при записи файла',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  }
}
