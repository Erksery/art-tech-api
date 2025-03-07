import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FolderService } from '../services/folders.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesConfig } from 'src/config/roles.config';
import { StatusGuard } from 'src/auth/guard/status.guard';
import { Status } from 'src/auth/decorators/status.decorator';
import { StatusConfig } from 'src/config/status.config';
import { FolderAccessGuard } from 'src/auth/guard/folderAccess.guard';
import { CreateFolderDto } from '../dto/createFolder.dto';

@Controller('folder')
@UseGuards(AuthGuard, RolesGuard, StatusGuard)
@Roles(RolesConfig.all)
@Status(StatusConfig.approved)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/get')
  async getFolders(@Req() req) {
    return this.folderService.get(req);
  }

  @UseGuards(FolderAccessGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('create')
  async createFolders(
    @Query('id') id: string,
    @Body() data: CreateFolderDto,
    @Req() req: Request,
  ) {
    return this.folderService.create(id || null, data, req);
  }

  @UseGuards(FolderAccessGuard)
  @Post('edit/:id')
  async editFolders(@Param('id') id: string) {
    return this.folderService.edit(id);
  }

  @UseGuards(FolderAccessGuard)
  @Post('delete/:id')
  async deleteFolders(@Param('id') id: string) {
    return this.folderService.delete(id);
  }
}
