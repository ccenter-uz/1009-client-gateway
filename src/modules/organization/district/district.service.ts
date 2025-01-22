import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  DistrictCreateDto,
  DistrictUpdateDto,
  DistrictInterfaces,
  DistrictServiceCommands as Commands,
} from 'types/organization/district';
import { DistrictFilterDto } from 'types/organization/district/dto/filter-district.dto';

@Injectable()
export class DistrictService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(query: DistrictFilterDto): Promise<DistrictInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<DistrictInterfaces.Response[], DistrictFilterDto>(
        { cmd: Commands.GET_ALL_LIST },
        query
      )
    );
  }

  async getById(data: GetOneDto): Promise<DistrictInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<DistrictInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }

  async create(
    data: DistrictCreateDto,
    userNumericId: string
  ): Promise<DistrictInterfaces.Response> {
    data = { staffNumber: userNumericId, ...data };
    return await lastValueFrom(
      this.adminClient.send<
        DistrictInterfaces.Response,
        DistrictInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }

  async update(data: DistrictUpdateDto): Promise<DistrictInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<
        DistrictInterfaces.Response,
        DistrictInterfaces.Update
      >({ cmd: Commands.UPDATE }, data)
    );
  }

  async delete(data: DeleteDto): Promise<DistrictInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<DistrictInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

  async restore(data: GetOneDto): Promise<DistrictInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<DistrictInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );
  }
}
