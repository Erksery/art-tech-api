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

@Controller('upload')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(...RolesConfig.all)
@Status(...StatusConfig.approved)
export class UploadController {
  constructor(private filesService: FilesService) {}

  @Post(':folderId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      return { message: 'Файл не загружен' };
    }

    const uploadDir = `../../../../${process.env.UPLOAD_FOLDER || 'uploads'}`;
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = join(uploadDir, fileName);

    // Используем потоковую запись для записи файла на диск
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      // Записываем файл через поток
      writeStream.write(file.buffer);
      writeStream.end();

      writeStream.on('finish', async () => {
        const savedFile = await this.filesService.fileUpload(
          folderId,
          file,
          req,
        );
        resolve(savedFile);
      });

      writeStream.on('error', (err) => reject(err));
    });
  }
}
