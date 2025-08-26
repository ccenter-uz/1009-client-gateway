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
  SavedOrganizationFilterDto,
  savedOrganizationDeleteDto,
} from 'types/organization/saved-organization';
import { CityFilterDto } from 'types/organization/city/dto/filter-city.dto';

@Injectable()
export class SavedOrganizationService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(
    query: SavedOrganizationFilterDto
  ): Promise<savedOrganizationInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<
        savedOrganizationInterfaces.Response[],
        SavedOrganizationFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
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

  async delete(
    data: savedOrganizationDeleteDto
  ): Promise<savedOrganizationInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<
        savedOrganizationInterfaces.Response,
        savedOrganizationDeleteDto
      >({ cmd: Commands.DELETE }, data)
    );
  }
}
