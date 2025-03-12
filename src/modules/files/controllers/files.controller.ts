import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { FindGuard } from 'src/auth/guard/file/find.guard';
import { CreateFileGuard } from 'src/auth/guard/file/createFile.guard';
import { EditFileGuard } from 'src/auth/guard/file/editFile.guard';
import { DeleteFileGuard } from 'src/auth/guard/file/deleteFile.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusConfig } from 'src/config/status.config';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(RolesConfig.all)
@Status(StatusConfig.approved)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('folder/:folderId')
  @UseGuards(FindGuard)
  async findAll(@Param('folderId') folderId: string, @Req() req: Request) {
    return this.filesService.findAll(folderId, req);
  }

  @Get('folder/:folderId/file/:fileId')
  @UseGuards(FindGuard)
  async findOne(@Param('fileId') fileId: string, @Req() req: Request) {
    return this.filesService.findOne(fileId, req);
  }

  @Post('upload/:folderId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./${process.env.UPLOAD_FOLDER}`,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async uploadFile(
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.filesService.fileUpload(folderId, file, req);
  }

  @Patch('folder/:folderId/file/:fileId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(EditFileGuard)
  async edit(
    @Param('fileId') fileId: string,
    @Body() data,
    @Req() req: Request,
  ) {
    return this.filesService.edit(fileId, data, req);
  }

  @Delete('folder/:folderId/file/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(DeleteFileGuard)
  async delete(@Param('fileId') fileId: string, @Req() req: Request) {
    return this.filesService.delete(fileId, req);
  }
}
