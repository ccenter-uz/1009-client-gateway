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
  GetSiteStatisticsDto,
} from 'types/organization/site-statistics';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('bisiness-statistics')
@Controller('bisiness-statistics')
export class SiteStatisticsController {
  constructor(private readonly siteStatisticsService: SiteStatisticsService) {}

  @Get('/one')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Query() query: GetSiteStatisticsDto,
    @Req() request: Request
  ): Promise<siteStatisticsInterfaces.Response> {
    return this.siteStatisticsService.getById(
      request['userData']?.organizationId,
      query
    );
  }

  @Post()
  @ApiBody({ type: siteStatisticsCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() data: siteStatisticsCreateDto
  ): Promise<siteStatisticsInterfaces.Response> {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.ip;
    const cleanIp = ip?.replace('::ffff:', '');
    const userAgent = req.headers['user-agent'];
    data.ip = cleanIp || 'unknown';
    data.userAgent = userAgent || 'unknown';

    return this.siteStatisticsService.create(data);
  }
}
