import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { NominatimService as NominatimService } from './nominatim.service';
import * as Multer from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NominatimReverseDto, NominatioumFilterDto } from 'types/nominatim';

@ApiBearerAuth()
@ApiTags('geocode')
@Controller('geocode')
export class NominatimController {
  constructor(private readonly nominatimService: NominatimService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search location by address' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Address or place name to search',
    example: 'UZTELECOM, 87, Nukus Street, Tashkent, Uzbekistan',
  })
  async getLocation(@Query() query: NominatioumFilterDto) {
    return this.nominatimService.search(query);
  }

  @Get('reverse')
  @ApiOperation({ summary: 'Reverse geocode (coordinates → address)' })
  async getReverse(@Query() query: NominatimReverseDto) {
    return this.nominatimService.reverse(query);
  }
}
