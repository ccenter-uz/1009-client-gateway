import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import {
  MonitoringServiceCommands as Commands,
  MonitoringInterfaces,
} from 'types/organization/monitoring';
import { MonitoringFilterDto } from 'types/organization/monitoring';

@Injectable()
export class MonitoringService {
  private logger = new Logger(MonitoringService.name);

  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(
    query: MonitoringFilterDto
  ): Promise<MonitoringInterfaces.OrganizationResponse[]> {
    const methodName: string = this.getAll.name;

    this.logger.debug(`Method: ${methodName} - Request: `, query);
    const response = lastValueFrom(
      this.adminClient.send<
        MonitoringInterfaces.OrganizationResponse[],
        MonitoringFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }
}
