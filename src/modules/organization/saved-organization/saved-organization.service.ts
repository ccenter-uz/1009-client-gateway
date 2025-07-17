import { Inject, Injectable, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  SavedOrganizationCreateDto,
  savedOrganizationUpdateDto,
  savedOrganizationInterfaces,
  GetOneSavedOrganizationDto,
  SavedOrganizationCommands as Commands,
} from 'types/organization/saved-organization';
import { CityFilterDto } from 'types/organization/city/dto/filter-city.dto';

@Injectable()
export class SavedOrganizationService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(
    query: CityFilterDto
  ): Promise<savedOrganizationInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<
        savedOrganizationInterfaces.Response[],
        CityFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
    );
  }

  async getById(
    data: GetOneSavedOrganizationDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<savedOrganizationInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }


  async create(
    data: SavedOrganizationCreateDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return await lastValueFrom(
      this.adminClient.send<
        savedOrganizationInterfaces.Response,
        savedOrganizationInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }

  async update(
    data: savedOrganizationUpdateDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<
        savedOrganizationInterfaces.Response,
        savedOrganizationInterfaces.Update
      >({ cmd: Commands.UPDATE }, data)
    );
  }

  async delete(data: DeleteDto): Promise<savedOrganizationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<savedOrganizationInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

  async restore(
    data: GetOneDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<savedOrganizationInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );
  }
}
