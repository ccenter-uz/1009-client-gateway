import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USER } from 'types/config';
import {
  DeleteDto,
  GetOneDto,
  ListQueryDto,
  UserPermissions,
} from 'types/global';
import {
  UserServiceCommands as Commands,
  UserCreateDto,
  UserUpdateDto,
  UserUpdateMeDto,
} from 'types/user/user';
import { UserInterfaces } from 'types/user/user';
import { CheckUserPermissionDto } from 'types/user/user/dto/check-permission.dto';
import { UserLogInDto } from 'types/user/user/dto/log-in-user.dto';
import { JwtConfig } from 'src/common/config/app.config';
import { UserForgetPwdDto } from 'types/user/user/dto/forget-pwd.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject(USER) private adminClient: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  async logIn(data: UserLogInDto): Promise<UserInterfaces.LogInResponse> {
    const methodName: string = this.logIn.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const user = await lastValueFrom(
      this.adminClient.send<
        UserInterfaces.Response,
        UserInterfaces.LogInRequest
      >({ cmd: Commands.LOG_IN }, data)
    );

    if (user?.error) {
      throw new UnauthorizedException(user?.error?.error);
    }

    this.logger.debug(`Method: ${methodName} - Role: `, user?.role?.name);

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        roleId: user.roleId,
      },
      { expiresIn: JwtConfig.expiresIn }
    );

    const response: UserInterfaces.LogInResponse = {
      accessToken,
      permissions: UserPermissions[user?.role?.name],
      role: user?.role?.name,
    };

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async checkPermission(data: CheckUserPermissionDto): Promise<boolean> {
    const methodName: string = this.checkPermission.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: boolean = await lastValueFrom(
      this.adminClient.send<boolean, UserInterfaces.CheckUserPermissionRequest>(
        { cmd: Commands.CHECK_PERMISSION },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async getListOfUsers(
    query: ListQueryDto
  ): Promise<UserInterfaces.Response[]> {
    const methodName: string = this.getListOfUsers.name;

    this.logger.debug(`Method: ${methodName} - Request: `, query);

    let response: UserInterfaces.Response[];

    response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response[], ListQueryDto>(
        { cmd: Commands.GET_ALL_LIST },
        query
      )
    );

    this.logger.debug(`Method: ${methodName} - Response if all: `, response);

    return response;
  }

  async getById(data: GetOneDto): Promise<UserInterfaces.Response> {
    const methodName: string = this.getById.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: UserInterfaces.Response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async getMeById(data: GetOneDto): Promise<UserInterfaces.Response> {
    const methodName: string = this.getMeById.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: UserInterfaces.Response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_ME_BY_ID },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async create(data: UserCreateDto): Promise<UserInterfaces.Response> {
    const methodName: string = this.create.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: UserInterfaces.Response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response, UserInterfaces.Request>(
        { cmd: Commands.CREATE },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async forgotPwd(data: UserForgetPwdDto): Promise<any> {
    try {
      const methodName: string = this.forgotPwd.name;

      this.logger.debug(`Method: ${methodName} - Request: `, data);

      // const response: UserInterfaces.Response = await lastValueFrom(
      //   this.adminClient.send<UserInterfaces.Response, UserInterfaces.Update>(
      //     { cmd: Commands.FORGOT_PWD },
      //     data
      //   )
      // );
      const response = true;
      this.logger.debug(`Method: ${methodName} - Response: `, response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateMe(data: UserUpdateMeDto): Promise<UserInterfaces.Response> {
    try {
      const methodName: string = this.updateMe.name;

      this.logger.debug(`Method: ${methodName} - Request: `, data);

      const response: UserInterfaces.Response = await lastValueFrom(
        this.adminClient.send<UserInterfaces.Response, UserInterfaces.UpdateMe>(
          { cmd: Commands.UPDATE_ME_BY_ID },
          data
        )
      );

      this.logger.debug(`Method: ${methodName} - Response: `, response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async delete(data: DeleteDto): Promise<UserInterfaces.Response> {
    const methodName: string = this.delete.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: UserInterfaces.Response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }

  async restore(data: GetOneDto): Promise<UserInterfaces.Response> {
    const methodName: string = this.restore.name;

    this.logger.debug(`Method: ${methodName} - Request: `, data);

    const response: UserInterfaces.Response = await lastValueFrom(
      this.adminClient.send<UserInterfaces.Response, GetOneDto>(
        { cmd: Commands.RESTORE },
        data
      )
    );

    this.logger.debug(`Method: ${methodName} - Response: `, response);

    return response;
  }
}
