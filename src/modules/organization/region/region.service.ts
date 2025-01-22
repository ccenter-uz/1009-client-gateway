import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  RegionCreateDto,
  RegionInterfaces,
  RegionUpdateDto,
  RegionServiceCommands as Commands,
} from 'types/organization/region';

@Injectable()
export class RegionService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(query: ListQueryDto): Promise<RegionInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<RegionInterfaces.Response[], ListQueryDto>(
        { cmd: Commands.GET_ALL_LIST },
        query
      )
    );
  }

  async getById(data: GetOneDto): Promise<RegionInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<RegionInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }

  async create(data: RegionCreateDto): Promise<RegionInterfaces.Response> {
    return await lastValueFrom(
      this.adminClient.send<
        RegionInterfaces.Response,
        RegionInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }

  async update(data: RegionUpdateDto): Promise<RegionInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<RegionInterfaces.Response, RegionInterfaces.Update>(
        { cmd: Commands.UPDATE },
        data
      )
    );
  }

  async delete(data: DeleteDto): Promise<RegionInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<RegionInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

  async restore(data: GetOneDto): Promise<RegionInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<RegionInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );
  }
}
