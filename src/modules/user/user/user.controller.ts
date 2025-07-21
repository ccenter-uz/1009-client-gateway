import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  UserCreateDto,
  UserInterfaces,
  UserUpdateDto,
  UserUpdateMeDto,
} from 'types/user/user';
import { UserLogInDto } from 'types/user/user/dto/log-in-user.dto';
import { UserService } from './user.service';
import { LanguageRequestDto, ListQueryDto } from 'types/global';
import { UserForgetPwdDto } from 'types/user/user/dto/forget-pwd.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('log-in')
  @ApiBody({ type: UserLogInDto })
  @HttpCode(HttpStatus.OK)
  async logIn(
    @Body() data: UserLogInDto
  ): Promise<UserInterfaces.LogInResponse> {
    return this.userService.logIn(data);
  }

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // async getListOfUsers(
  //   @Req() request: Request,
  //   @Query() query: ListQueryDto
  // ): Promise<UserInterfaces.Response[]> {
  //   return await this.userService.getListOfUsers({
  //     ...query,
  //     logData: request.body['userData'],
  //   });
  // }

  @Get('get-me')
  @HttpCode(HttpStatus.OK)
  async getMeById(@Req() request: Request): Promise<UserInterfaces.Response> {
    console.log(request.body['userData'].user.id, 'request.body');

    return this.userService.getMeById({
      id: +request.body['userData'].user.id,
      logData: request.body['userData'],
    });
  }

  @Put('update-me')
  @ApiBody({ type: UserUpdateMeDto })
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @Req() request: Request,
    @Body() data: Omit<UserUpdateMeDto, 'id'>
  ): Promise<UserInterfaces.Response> {
    console.log(request.body['userData'], 'request.body');

    return this.userService.updateMe({
      ...data,
      id: +request.body['userData'].user.id,
      logData: request.body['userData'],
    });
  }

  // @Get(':id')
  // @ApiParam({ name: 'id' })
  // @HttpCode(HttpStatus.OK)
  // async getById(
  //   @Req() request: Request,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query() query: LanguageRequestDto
  // ): Promise<UserInterfaces.Response> {
  //   return this.userService.getById({
  //     id,
  //     ...query,
  //     logData: request.body['userData'],
  //   });
  // }

  @Post()
  @ApiBody({ type: UserCreateDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: Request,
    @Body() data: UserCreateDto
  ): Promise<UserInterfaces.Response> {
    return this.userService.create({
      ...data,
      logData: request.body['userData'],
    });
  }

  @Put('forgot-pwd')
  @ApiBody({ type: UserUpdateDto })
  @HttpCode(HttpStatus.OK)
  async forgotPwd(
    @Req() request: Request,
    @Body() data: Omit<UserForgetPwdDto, 'id'>
  ): Promise<UserInterfaces.Response> {
    return this.userService.forgotPwd({
      ...data,
      id: +request.body['userData'].user.id,
    });
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async delete(
  //   @Req() request: Request,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query('delete') deleteQuery?: boolean
  // ): Promise<UserInterfaces.Response> {
  //   return this.userService.delete({
  //     id,
  //     delete: deleteQuery,
  //     logData: request.body['userData'],
  //   });
  // }

  // @Put(':id/restore')
  // @HttpCode(HttpStatus.OK)
  // async restore(
  //   @Req() request: Request,
  //   @Param('id', ParseIntPipe) id: number
  // ): Promise<UserInterfaces.Response> {
  //   return this.userService.restore({ id, logData: request.body['userData'] });
  // }
}
