import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto } from 'types/global';
import {
  OrganizationCreateDto,
  OrganizationInterfaces,
  OrganizationServiceCommands as Commands,
} from 'types/organization/organization';
import * as Multer from 'multer';
import { GoogleCloudStorageService } from 'src/modules/file-upload/google-cloud-storage.service';
import {
  OrganizationVersionInterfaces,
  OrganizationVersionUpdateDto,
  OrganizationVersionServiceCommands as CommmandsVersion,
} from 'types/organization/organization-version';
import { OrganizationFilterDto } from 'types/organization/organization/dto/filter-organization.dto';
import { ConfirmDto } from 'types/organization/organization/dto/confirm-organization.dto';
import { MyOrganizationFilterDto } from 'types/organization/organization/dto/filter-my-organization.dto';
import { OrganizationDeleteDto } from 'types/organization/organization/dto/delete-organization.dto';
import { OrganizationRestoreDto } from 'types/organization/organization/dto/get-restore-organization.dto';
import { UnconfirmOrganizationFilterDto } from 'types/organization/organization/dto/filter-unconfirm-organization.dto';

@Injectable()
export class OrganizationService {
  private logger = new Logger(OrganizationService.name);
  constructor(
    @Inject(ORGANIZATION) private adminClient: ClientProxy,
    private readonly googleCloudStorageService: GoogleCloudStorageService
  ) {}

  async getListOrganization(
    query: OrganizationFilterDto,
    userNumericId: string,
    role: string
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getListOrganization.name;
    query.staffNumber = userNumericId;
    query.role = role;
    this.logger.debug(
      `Method: ${methodName} - Request: `,
      OrganizationFilterDto
    );

    const response = await lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response[],
        OrganizationFilterDto
      >({ cmd: Commands.GET_ALL_LIST }, query)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async getMyOrganization(
    query: MyOrganizationFilterDto,
    userNumericId: string,
    role: string
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getMyOrganization.name;
    query.staffNumber = userNumericId;
    query.role = role;
    this.logger.debug(
      `Method: ${methodName} - Request: `,
      MyOrganizationFilterDto
    );

    const response = lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response[],
        MyOrganizationFilterDto
      >({ cmd: Commands.GET_MY_LIST }, query)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async getUnconfirm(
    query: UnconfirmOrganizationFilterDto,
    userNumericId: string
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getUnconfirm.name;
    query.staffNumber = userNumericId;
    this.logger.debug(
      `Method: ${methodName} - Request: `,
      UnconfirmOrganizationFilterDto
    );

    const response = await lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response[],
        UnconfirmOrganizationFilterDto
      >({ cmd: Commands.GET_UNCONFIRM_LIST }, query)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async getById(
    data: GetOneDto,
    role: string
  ): Promise<OrganizationInterfaces.Response> {
    const methodName: string = this.getListOrganization.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);
    data.role = role;
    const response = await lastValueFrom(
      this.adminClient.send<OrganizationInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async create(
    data: OrganizationCreateDto,
    role: string,
    userNumericId: string,
    files: Array<Multer.File>
  ): Promise<OrganizationInterfaces.Response> {
    const methodName: string = this.create.name;

    const fileLinks = await this.googleCloudStorageService.uploadFiles(files);

    this.logger.debug(`Method: ${methodName} - Upload File: `, fileLinks);

    data = {
      ...data,
      role,
      staffNumber: userNumericId,
      PhotoLink: fileLinks,
      phone:
        typeof data.phone == 'string' ? JSON.parse(data.phone) : data.phone,
      productService:
        typeof data.productService == 'string'
          ? JSON.parse(data.productService)
          : data.productService,
      nearby:
        typeof data.nearby == 'string' ? JSON.parse(data.nearby) : data.nearby,
    };

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = await lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response,
        OrganizationInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async update(
    data: OrganizationVersionUpdateDto,
    role: string,
    userNumericId: string,
    files: Array<Multer.File>
  ): Promise<OrganizationVersionInterfaces.Response> {
    const methodName: string = this.update.name;

    const fileLinks = await this.googleCloudStorageService.uploadFiles(files);
    data = {
      ...data,
      role,
      staffNumber: userNumericId,
      PhotoLink: fileLinks,
      phone:
        typeof data.phone == 'string' ? JSON.parse(data.phone) : data.phone,
      productService:
        typeof data.productService == 'string'
          ? JSON.parse(data.productService)
          : data.productService,
      nearby:
        typeof data.nearby == 'string' ? JSON.parse(data.nearby) : data.nearby,
      picture:
        typeof data.picture == 'string'
          ? JSON.parse(data.picture)
          : data.picture,
    };

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = lastValueFrom(
      this.adminClient.send<
        OrganizationVersionInterfaces.Response,
        OrganizationVersionInterfaces.Update
      >({ cmd: CommmandsVersion.UPDATE }, data)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }
  async updateCheck(
    data: ConfirmDto,
    role: string,
    userNumericId: string
  ): Promise<OrganizationVersionInterfaces.Response> {
    const methodName: string = this.updateCheck.name;

    data = {
      ...data,
      role,
      staffNumber: userNumericId,
    };

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response,
        OrganizationInterfaces.Update
      >({ cmd: Commands.CHECK }, data)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async delete(
    data: OrganizationDeleteDto
  ): Promise<OrganizationInterfaces.Response> {
    const methodName: string = this.delete.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response,
        OrganizationDeleteDto
      >({ cmd: Commands.DELETE }, data)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }

  async restore(
    data: OrganizationRestoreDto
  ): Promise<OrganizationInterfaces.Response> {
    const methodName: string = this.restore.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response,
        OrganizationRestoreDto
      >({ cmd: Commands.RESTORE }, data)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }
}
