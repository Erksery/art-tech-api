import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Req,
  UseGuards,
  Patch,
  Res,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { FindGuard } from 'src/auth/guard/file/find.guard';
import { EditFileGuard } from 'src/auth/guard/file/editFile.guard';
import { DeleteFileGuard } from 'src/auth/guard/file/deleteFile.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';
import { SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes';
import { PARAMS_VALUES, QUERY_VALUES } from 'src/config/constants.config';

@Controller(SITE_CONTROLLER.FILE)
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles()
@Status(...StatusConfig.approved)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(SITE_ROUTES.FIND_ALL)
  @UseGuards(FindGuard)
  async findAll(
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Query(QUERY_VALUES.ORDER) order?: string,
    @Query(QUERY_VALUES.FILTER) filter?: string,
    @Query(QUERY_VALUES.SEARCH) search?: string,
  ) {
    return this.filesService.findAll(folderId, order, filter, search);
  }

  @Get(SITE_ROUTES.SEARCH_ALL_FILES)
  @UseGuards(FindGuard)
  async searchAllFiles(
    @Req() req: Request,
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Query(QUERY_VALUES.SEARCH) searchValue: string,
    @Query(QUERY_VALUES.LOCATION) location: string,
  ) {
    return this.filesService.searchAllFiles(
      folderId,
      searchValue,
      location,
      req,
    );
  }

  @Get(SITE_ROUTES.FIND_ONE)
  @UseGuards(FindGuard)
  async findOne(@Param(PARAMS_VALUES.FILE_ID) fileId: string) {
    return this.filesService.findOne(fileId);
  }

  @Get(SITE_ROUTES.GET_IMAGE)
  @UseGuards(FindGuard)
  async getImage(
    @Param(PARAMS_VALUES.FILE_NAME) fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = await this.filesService.getFilePath(fileName, req);

    if (!filePath) {
      throw new NotFoundException('Файл не найден');
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Ошибка при отправке файла:', err);
        if (!res.headersSent) {
          res.status(500).send('Ошибка при отправке файла');
        }
      }
    });
  }

  @Get(SITE_ROUTES.DOWNLOAD)
  @UseGuards(FindGuard)
  async downloadFile(
    @Param(PARAMS_VALUES.FILE_ID) fileId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = await this.filesService.getFilePath(fileId, req);

    if (!filePath) {
      throw new NotFoundException('Файл не найден');
    }

    return res.download(filePath);
  }

  @Patch(SITE_ROUTES.EDIT)
  @HttpCode(HttpStatus.OK)
  @UseGuards(EditFileGuard)
  async edit(
    @Param(PARAMS_VALUES.FILE_ID) fileId: string,
    @Body() data,
    @Req() req: Request,
  ) {
    return this.filesService.edit(fileId, data, req);
  }

  @Delete(SITE_ROUTES.DELETE)
  @HttpCode(HttpStatus.OK)
  @UseGuards(DeleteFileGuard)
  async delete(
    @Param(PARAMS_VALUES.FILE_ID) fileId: string,
    @Req() req: Request,
  ) {
    return this.filesService.delete(fileId, req);
  }
}
