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
import { SavedOrganizationService } from './saved-organization.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LanguageRequestDto, ListQueryDto } from 'types/global';

import {
  SavedOrganizationCreateDto,
  savedOrganizationUpdateDto,
  savedOrganizationInterfaces,
  SavedOrganizationFilterDto,
} from 'types/organization/saved-organization';
import { CityFilterDto } from 'types/organization/city/dto/filter-city.dto';

@ApiBearerAuth()
@ApiTags('saved-organization')
@Controller('saved-organization')
export class SavedOrganizationController {
  constructor(private readonly subCategoryService: SavedOrganizationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Req() request: Request,
    @Query() query: SavedOrganizationFilterDto
  ): Promise<savedOrganizationInterfaces.Response[]> {
    return await this.subCategoryService.getAll({
      ...query,
      userId: request['userData']?.user?.id,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: LanguageRequestDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.getById({ id, ...query });
  }

  @Post()
  @ApiBody({ type: SavedOrganizationCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: SavedOrganizationCreateDto,
    @Req() request: Request
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.create({
      ...data,
      userId: request['userData']?.user?.id,
    });
  }

  @Put(':organizationId')
  @ApiBody({ type: savedOrganizationUpdateDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('organizationId', ParseIntPipe) id: number,
    @Body() data: Omit<savedOrganizationUpdateDto, 'id'>
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.update({ ...data, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('delete') deleteQuery?: boolean
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.delete({ id, delete: deleteQuery });
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(
    @Param('id', ParseIntPipe) id: number
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.restore({ id });
  }
}
