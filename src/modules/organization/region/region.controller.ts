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
import { RegionService } from './region.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LanguageRequestDto, ListQueryDto } from 'types/global';
import {
  RegionCreateDto,
  RegionInterfaces,
  RegionUpdateDto,
} from 'types/organization/region';

@ApiBearerAuth()
@ApiTags('region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: ListQueryDto
  ): Promise<RegionInterfaces.Response[]> {
    return await this.regionService.getAll(query);
  }

  // @Get(':id')
  // @ApiParam({ name: 'id' })
  // @HttpCode(HttpStatus.OK)
  // async getById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query() query: LanguageRequestDto
  // ): Promise<RegionInterfaces.Response> {
  //   return this.regionService.getById({ id, ...query });
  // }

  @Post()
  @ApiBody({ type: RegionCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: RegionCreateDto
  ): Promise<RegionInterfaces.Response> {
    return this.regionService.create(data);
  }

  // @Put(':id')
  // @ApiBody({ type: RegionUpdateDto })
  // @HttpCode(HttpStatus.OK)
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() data: Omit<RegionUpdateDto, 'id'>
  // ): Promise<RegionInterfaces.Response> {
  //   return this.regionService.update({ ...data, id });
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async delete(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query('delete') deleteQuery?: boolean
  // ): Promise<RegionInterfaces.Response> {
  //   return this.regionService.delete({ id, delete: deleteQuery });
  // }

  // @Put(':id/restore')
  // @HttpCode(HttpStatus.OK)
  // async restore(
  //   @Param('id', ParseIntPipe) id: number
  // ): Promise<RegionInterfaces.Response> {
  //   return this.regionService.restore({ id });
  // }
}
