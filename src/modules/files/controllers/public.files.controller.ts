import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PUBLIC_SITE_CONTROLLER, SITE_ROUTES } from '../routes/site.routes';
import { FilesService } from '../services/files.service';
import { PARAMS_VALUES, QUERY_VALUES } from 'src/config/constants.config';
import { PublicFindGuard } from 'src/auth/guard/file/public.find.guard';
import { join } from 'path';

import { Request, Response } from 'express';

@Controller(PUBLIC_SITE_CONTROLLER.FILE)
export class PublicFilesController {
  constructor(private filesService: FilesService) {}

  @Get(SITE_ROUTES.FIND_ALL)
  @UseGuards(PublicFindGuard)
  async findAll(
    @Param(PARAMS_VALUES.FOLDER_ID) folderId: string,
    @Query(QUERY_VALUES.ORDER) order?: string,
    @Query(QUERY_VALUES.FILTER) filter?: string,
    @Query(QUERY_VALUES.SEARCH) search?: string,
  ) {
    return this.filesService.findAll(folderId, order, filter, search);
  }

  @Get(SITE_ROUTES.GET_COMPRESSED_IMAGE)
  @UseGuards(PublicFindGuard)
  async getCompressedImage(
    @Param(PARAMS_VALUES.FILE_NAME) fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const compressDir = join(process.cwd(), 'compress', fileName);

    if (!compressDir) {
      throw new NotFoundException('Файл не найден');
    }
    res.sendFile(compressDir, (err) => {
      if (err) {
        console.error('Ошибка при отправке файла:', err);
        if (!res.headersSent) {
          res.status(500).send('Ошибка при отправке файла');
        }
      }
    });
  }

  @Get(SITE_ROUTES.DOWNLOAD)
  @UseGuards(PublicFindGuard)
  async downloadFile(
    @Res() res: Response,
    @Query(QUERY_VALUES.FILENAME) fileName: string,
  ) {
    const filePath = join(process.cwd(), 'uploads', fileName);

    if (!filePath) {
      throw new NotFoundException('Файл не найден');
    }
    console.log(filePath);
    res.download(filePath);
  }

  @Get(SITE_ROUTES.GET_VIDEO)
  async getVideo(
    @Param(PARAMS_VALUES.FILE_NAME) fileName: string,
    @Req() req: Request,
    @Res() res,
  ) {
    return this.filesService.getVideo(req, res, fileName);
  }
}
