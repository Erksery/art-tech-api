import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Req,
  Res,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import Busboy from 'busboy';
import { Request, Response } from 'express';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateFileGuard } from 'src/auth/guard/file/createFile.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusConfig } from 'src/config/status.config';
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes';
import { PARAMS_VALUES } from 'src/config/constants.config';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

@Controller(SITE_CONTROLLER.UPLOAD)
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(...RolesConfig.all)
@Status(...StatusConfig.approved)
export class UploadController {
  constructor(private filesService: FilesService) {}

  @Post(SITE_ROUTES.UPLOAD)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  async uploadFile(
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const busboy = Busboy({ headers: req.headers });

    const uploadDir = join(process.cwd(), 'uploads');
    const compressDir = join(process.cwd(), 'compress');

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    if (!existsSync(compressDir)) {
      mkdirSync(compressDir, { recursive: true });
    }

    let originalName = '';
    let savedFile: any;
    let fileSize = 0;
    let fileMimeType = '';
    let fileEncoding = '';
    let uniqueName = '';
    let savePath = '';

    busboy.on('file', (fieldname, file, fileInfo) => {
      originalName = Buffer.from(fileInfo.filename, 'latin1').toString('utf8');
      fileMimeType = fileInfo.mimeType;
      fileEncoding = fileInfo.encoding;

      uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}`;
      savePath = join(uploadDir, uniqueName);

      const writeStream = createWriteStream(savePath);

      file.on('data', (chunk) => {
        fileSize += chunk.length;
        console.log(`Загружено: ${fileSize} байт`);
      });

      file.on('end', () => {
        console.log(`Файл ${originalName} успешно загружен.`);
      });

      file.on('error', (err) => {
        console.error('Ошибка при записи файла:', err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Ошибка при записи файла',
        });
      });

      file.pipe(writeStream);

      writeStream.on('finish', async () => {
        try {
          if (fileMimeType.startsWith('image/')) {
            const compressedPath = join(compressDir, `${uniqueName}.webp`);
            const compressedImageBuffer = await sharp(savePath)
              .resize({
                width: 800,
                withoutEnlargement: true,
              })
              .webp({ quality: 75 })
              .toBuffer();

            await writeFile(compressedPath, compressedImageBuffer);
          }

          savedFile = await this.filesService.fileUpload(
            folderId,
            uniqueName,
            originalName,
            { mimetype: fileMimeType, encoding: fileEncoding, size: fileSize },
            req,
          );

          res.status(HttpStatus.CREATED).json({
            message: 'Файл успешно загружен и сохранён в БД',
            file: savedFile,
          });
        } catch (err) {
          console.error('Ошибка при сохранении файла в БД:', err);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Ошибка при сохранении файла в БД',
          });
        }
      });
    });

    req.pipe(busboy);
  }
}
