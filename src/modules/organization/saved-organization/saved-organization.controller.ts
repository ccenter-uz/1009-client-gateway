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
      savedOrganization: true,
      userId: request['userData']?.user?.id,
    });
  }

  @Post(':organizationId')
  // @ApiBody({ type: SavedOrganizationCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: Request,
    @Param('organizationId', ParseIntPipe) id: number
    // @Body() data: SavedOrganizationCreateDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.create({
      organizationId: id,
      userId: request['userData']?.user?.id,
    });
  }

  @Delete(':organizationId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('organizationId', ParseIntPipe) id: number
    // @Query('delete') deleteQuery?: boolean
  ): Promise<savedOrganizationInterfaces.Response> {
    return this.subCategoryService.delete({
      id,
      userId: request['userData']?.user?.id,
    });
  }
}
