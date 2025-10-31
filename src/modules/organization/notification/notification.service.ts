import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  NotificationServiceCommands as Commands,
  NotificationInterfaces,
  NotificationCreateDto,
  NotificationUpdateDto,

} from 'types/organization/notification';
import { NotificationFilterDto } from 'types/organization/notification/dto/filter-notification.dto';

@Injectable()
export class NotificationService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(
    query: NotificationFilterDto
  ): Promise<NotificationInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<
        NotificationInterfaces.Response[],
        NotificationFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
    );
  }

  async getById(data: GetOneDto): Promise<NotificationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<NotificationInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }

  async update(
    data: NotificationUpdateDto
  ): Promise<NotificationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<
        NotificationInterfaces.Response,
        NotificationInterfaces.Update
      >({ cmd: Commands.UPDATE }, data)
    );
  }

  async delete(data: DeleteDto): Promise<NotificationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<NotificationInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

  async restore(data: GetOneDto): Promise<NotificationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<NotificationInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );
  }
}
