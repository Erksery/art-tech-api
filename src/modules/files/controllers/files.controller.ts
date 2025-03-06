import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { File } from '../interfaces/File.interface';
import { FilesService } from '../services/files.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesConfig } from 'src/config/roles.config';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  async findAll(): Promise<File[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesConfig.all)
  findOne(@Req() request: Request) {
    return this.filesService.findOne(request.params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() file: File) {
    try {
      this.filesService.create(file);
      return { message: 'Файл создан', file: file };
    } catch (err) {
      throw err;
    }
  }
}
