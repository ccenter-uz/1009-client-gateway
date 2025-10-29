import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import {
  MonitoringFilterDto,
  MonitoringInterfaces,
} from 'types/organization/monitoring';

@ApiBearerAuth()
@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('organization')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Req() request: Request,
    @Query() query: MonitoringFilterDto
  ): Promise<MonitoringInterfaces.OrganizationResponse[]> {
    return await this.monitoringService.getAll({
      organizationId: request['userData']?.organizationId,
      ...query,
      staffNumber: request['userData'].user.numericId,
      role: request['userData'].user.role,
    });
  }
}
