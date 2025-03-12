import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FolderService } from '../services/folders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { DeleteFolderGuard } from 'src/auth/guard/folder/deleteFolder.guard';
import { CreateFolderGuard } from 'src/auth/guard/folder/createFolder.guard';
import { EditFolderGuard } from 'src/auth/guard/folder/editFolder.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';
import { RolesConfig } from 'src/config/roles.config';
import { CreateFolderDto } from '../dto/createFolder.dto';
import { EditFolderDto } from '../dto/editFolder.dto';

@Controller('folders')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(RolesConfig.all)
@Status(StatusConfig.approved)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/')
  async findAll(@Req() req: Request) {
    return this.folderService.get(req);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateFolderGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: CreateFolderDto, @Req() req: Request) {
    return this.folderService.create(data.folderId || null, data, req);
  }

  @Patch('/:folderId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(EditFolderGuard)
  async edit(@Param('folderId') folderId: string, @Body() data: EditFolderDto) {
    return this.folderService.edit(folderId, data);
  }

  @Delete('/:folderId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(DeleteFolderGuard)
  async delete(@Param('folderId') folderId: string) {
    return this.folderService.delete(folderId);
  }
}
