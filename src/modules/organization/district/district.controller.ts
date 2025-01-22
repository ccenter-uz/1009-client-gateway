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
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LanguageRequestDto, ListQueryDto } from 'types/global';

import {
  DistrictCreateDto,
  DistrictUpdateDto,
  DistrictInterfaces,
} from 'types/organization/district';
import { DistrictFilterDto } from 'types/organization/district/dto/filter-district.dto';

@ApiBearerAuth()
@ApiTags('district')
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: DistrictFilterDto
  ): Promise<DistrictInterfaces.Response[]> {
    return await this.districtService.getAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: LanguageRequestDto
  ): Promise<DistrictInterfaces.Response> {
    return this.districtService.getById({ id, ...query });
  }

  @Post()
  @ApiBody({ type: DistrictCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: DistrictCreateDto,
    @Req() request: Request
  ): Promise<DistrictInterfaces.Response> {
    return this.districtService.create(
      data,
      request.body['userData'].user.numericId
    );
  }

  @Put(':id')
  @ApiBody({ type: DistrictUpdateDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Omit<DistrictUpdateDto, 'id'>
  ): Promise<DistrictInterfaces.Response> {
    return this.districtService.update({ ...data, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('delete') deleteQuery?: boolean
  ): Promise<DistrictInterfaces.Response> {
    return this.districtService.delete({ id, delete: deleteQuery });
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DistrictInterfaces.Response> {
    return this.districtService.restore({ id });
  }
}
