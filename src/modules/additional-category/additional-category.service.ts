import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  AdditionalCategoryCreateDto,
  AdditionalCategoryInterfaces,
  AdditionalCategoryUpdateDto,
  AdditionalCategoryServiceCommands as Commands,
} from 'types/organization/additional-category';
import { AdditionalCategoryFilterDto } from 'types/organization/additional-category/dto/filter-additional-category.dto';

@Injectable()
export class AdditionalCategoryService {
  constructor(@Inject(ORGANIZATION) private adminClient: ClientProxy) {}

  async getAll(
    query: AdditionalCategoryFilterDto
  ): Promise<AdditionalCategoryInterfaces.Response[]> {
    return lastValueFrom(
      this.adminClient.send<
        AdditionalCategoryInterfaces.Response[],
        AdditionalCategoryFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
    );
  }

  async getById(
    data: GetOneDto
  ): Promise<AdditionalCategoryInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<AdditionalCategoryInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }

  async create(
    data: AdditionalCategoryCreateDto
  ): Promise<AdditionalCategoryInterfaces.Response> {
    return await lastValueFrom(
      this.adminClient.send<
        AdditionalCategoryInterfaces.Response,
        AdditionalCategoryInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }

  async update(
    data: AdditionalCategoryUpdateDto
  ): Promise<AdditionalCategoryInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<
        AdditionalCategoryInterfaces.Response,
        AdditionalCategoryInterfaces.Update
      >({ cmd: Commands.UPDATE }, data)
    );
  }

  async delete(
    data: DeleteDto
  ): Promise<AdditionalCategoryInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<AdditionalCategoryInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

  async restore(
    data: GetOneDto
  ): Promise<AdditionalCategoryInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<AdditionalCategoryInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );
  }
}
