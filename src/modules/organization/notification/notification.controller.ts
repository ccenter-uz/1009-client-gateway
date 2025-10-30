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
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { LanguageRequestDto, ListQueryDto } from 'types/global';

import {
  NotificationUpdateDto,
  NotificationCreateDto,
  NotificationInterfaces,
} from 'types/organization/notification';
import { DistrictFilterDto } from 'types/organization/district/dto/filter-district.dto';
import { NotificationFilterDto } from 'types/organization/notification/dto/filter-notification.dto';

@ApiBearerAuth()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly districtService: NotificationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: NotificationFilterDto
  ): Promise<NotificationInterfaces.Response[]> {
    return await this.districtService.getAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: LanguageRequestDto
  ): Promise<NotificationInterfaces.Response> {
    return this.districtService.getById({ id, ...query });
  }

  @Put()
  @ApiBody({ type: NotificationUpdateDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: Request,
    @Body() data: Omit<NotificationUpdateDto, 'id'>
  ): Promise<NotificationInterfaces.Response> {
    return this.districtService.update({
      ...data,
      id: request['userData']?.organizationId,
    });
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async delete(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query('delete') deleteQuery?: boolean
  // ): Promise<NotificationInterfaces.Response> {
  //   return this.districtService.delete({ id, delete: deleteQuery });
  // }

  // @Put(':id/restore')
  // @HttpCode(HttpStatus.OK)
  // async restore(
  //   @Param('id', ParseIntPipe) id: number
  // ): Promise<NotificationInterfaces.Response> {
  //   return this.districtService.restore({ id });
  // }
}
