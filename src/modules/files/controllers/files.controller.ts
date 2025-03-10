import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';
import { FindGuard } from 'src/auth/guard/file/find.guard';
import { CreateFileGuard } from 'src/auth/guard/file/createFile.guard';
import { EditFileGuard } from 'src/auth/guard/file/editFile.guard';
import { DeleteFileGuard } from 'src/auth/guard/file/deleteFile.guard';

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

  @Post('folder/:folderId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFileGuard)
  async create(
    @Param('folderId') folderId: string,
    @Body() file,
    @Req() req: Request,
  ) {
    return this.filesService.create(folderId, file, req);
  }

  @Put('folder/:folderId/file/:fileId')
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
