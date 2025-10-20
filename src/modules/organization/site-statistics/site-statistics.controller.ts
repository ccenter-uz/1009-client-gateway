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
import { SiteStatisticsService } from './site-statistics.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LanguageRequestDto, ListQueryDto } from 'types/global';

import {
  siteStatisticsCreateDto,
  siteStatisticsInterfaces,
  siteStatisticsFilterDto,
} from 'types/organization/site-statistics';

@ApiBearerAuth()
@ApiTags('bisiness-statistics')
@Controller('bisiness-statistics')
export class SiteStatisticsController {
  constructor(private readonly siteStatisticsService: SiteStatisticsService) {}

  @Get('/one')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Query() query: LanguageRequestDto,
    @Req() request: Request
  ): Promise<siteStatisticsInterfaces.Response> {
    return this.siteStatisticsService.getById({
      id: request['userData']?.organizationId,
      ...query,
    });
  }

  @Post()
  @ApiBody({ type: siteStatisticsCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: siteStatisticsCreateDto
  ): Promise<siteStatisticsInterfaces.Response> {
    return this.siteStatisticsService.create(data);
  }

}
