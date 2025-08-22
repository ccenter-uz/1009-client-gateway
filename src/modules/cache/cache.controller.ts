import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CacheInterfaces, CacheCreateDto } from 'types/organization/cache';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as Multer from 'multer';
@ApiBearerAuth()
@ApiTags('cache')
@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Req() request: Request): Promise<CacheInterfaces.Response> {
    return this.cacheService.getById({
      id: request['userData']?.organizationId,
      logData: request['userData'],
    });
  }

  @Post()
  @ApiBody({ type: CacheCreateDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 99 },
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ])
  )
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CacheCreateDto,
    @Req() request: Request,
    @UploadedFiles()
    files: {
      photos?: Multer.File[];
      logo?: Multer.File[];
      banner?: Multer.File[];
    }
  ): Promise<CacheInterfaces.Response> {
    return this.cacheService.create(
      {
        id: request['userData']?.organizationId,
        ...data,
      },
      files
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() request: Request): Promise<CacheInterfaces.Response> {
    return this.cacheService.delete({
      id: request['userData']?.organizationId,
      logData: request['userData'],
    });
  }
}
