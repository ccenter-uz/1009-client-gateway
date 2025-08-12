import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { CreatedByEnum, DeleteDto, GetOneDto } from 'types/global';
import {
  OrganizationCreateDto,
  OrganizationInterfaces,
  OrganizationServiceCommands as Commands,
  OrganizationBusinessCreateDto,
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
import { OrganizationFilterBusinessDto } from 'types/organization/organization/dto/filter-business.dto';
import { UserService } from 'src/modules/user/user/user.service';
import { MinioService } from 'src/modules/minio/minio.service';
import { MinioConfig } from 'src/common/config/app.config';

@Injectable()
export class OrganizationService {
  private logger = new Logger(OrganizationService.name);
  constructor(
    @Inject(ORGANIZATION) private adminClient: ClientProxy,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly googleCloudStorageService: GoogleCloudStorageService,
    private readonly Minioservice: MinioService
  ) {}

  async getListOrganization(
    query: OrganizationFilterDto,
    userNumericId: string,
    role: string,
    userId: number
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getListOrganization.name;

    query.staffNumber = userNumericId;
    query.role = role;
    // query.logData = userData?.user;
    query.userId = userId;

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

  async getOrganizationBusiness(
    query: OrganizationFilterBusinessDto,
    userNumericId: string,
    role: string,
    userId: number
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getOrganizationBusiness.name;

    this.logger.debug(
      `Method: ${methodName} - Request: `,
      OrganizationFilterBusinessDto
    );

    const response = await lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response[],
        OrganizationFilterBusinessDto
      >({ cmd: Commands.GET_BUSINESS }, query)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);
    return response;
  }
  async getOrganizationSearch(
    name: string
  ): Promise<OrganizationInterfaces.Response[]> {
    const methodName: string = this.getOrganizationSearch.name;

    this.logger.debug(`Method: ${methodName} - Request: `, name);

    const response = await lastValueFrom(
      this.adminClient.send<OrganizationInterfaces.Response[], { name }>(
        { cmd: Commands.GET_SEARCH },
        { name }
      )
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

  async getByIdVersion(
    data: GetOneDto
  ): Promise<OrganizationInterfaces.Response> {
    const methodName: string = this.getByIdVersion.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = lastValueFrom(
      this.adminClient.send<OrganizationInterfaces.Response, GetOneDto>(
        { cmd: CommmandsVersion.GET_BY_ID },
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

  async createBusiness(
    data: OrganizationBusinessCreateDto
  ): Promise<OrganizationInterfaces.ResponseBusiness> {
    const methodName: string = this.create.name;

    const responseUser = await this.userService.createBusiness({
      phoneNumber: data.phoneNumber,
      email: data.email,
    });

    this.logger.debug(`Method: ${methodName} - Response user: `, responseUser);

    let orgCreate: OrganizationCreateDto = {
      certificate: data.certificate,
      inn: data.inn,
      address: data.address,
      staffNumber: responseUser.numericId,
      role: CreatedByEnum.Business,
      paymentTypes: {
        cash: false,
        terminal: false,
        transfer: false,
      },
      workTime: {},
      phone: {
        phones: [
          {
            phone: data.phoneNumber,
            phoneTypeId: null,
            isSecret: false,
          },
        ],
      },
      productService: {
        productServices: [],
      },
      nearby: {
        nearbees: [],
      },
      social: {},
      PhotoLink: [],
    };

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response = await lastValueFrom(
      this.adminClient.send<
        OrganizationInterfaces.Response,
        OrganizationInterfaces.Request
      >({ cmd: Commands.CREATE }, orgCreate)
    );
    this.logger.debug(`Method: ${methodName} - Response: `, response);

    if (response) {
      const sendSms = await this.userService.logInBusiness({
        phoneNumber: data.phoneNumber,
      });
      return sendSms;
    }
  }

  async update(
    data: OrganizationVersionUpdateDto,
    files: {
      photos?: Multer.File[];
      logo?: Multer.File[];
      banner?: Multer.File[];
    }
  ): Promise<OrganizationVersionInterfaces.Response> {
    const methodName: string = this.update.name;

    const fileLinks = await this.Minioservice.uploadFiles(files?.photos || []);

    let logoLink = data.logoLink;
    if (files?.logo?.length > 0) {
      let logoLinks = await this.Minioservice.uploadFiles(
        files.logo,
        MinioConfig.bucketName
      );
      logoLink = logoLinks[0]?.link;
    }
    if (data?.site) {
      let site =
        typeof data?.site == 'string' ? JSON.parse(data?.site) : data?.site;
      let bannerUrl = site?.banner;
      if (files?.banner?.length > 0) {
        let bannerUrls = await this.Minioservice.uploadFiles(
          files.banner,
          MinioConfig.bucketName
        );
        bannerUrl = bannerUrls[0]?.link;
      }
      data.site = {
        ...site,
        banner: bannerUrl,
      };
    }

    data = {
      ...data,
      social: data.social,
      PhotoLink: fileLinks,
      logoLink,
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
    const response = await lastValueFrom(
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
