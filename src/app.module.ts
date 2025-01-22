import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  JwtConfig,
  servicesRmqConfig,
} from './common/config/app.config';
import { serviceConfig } from 'types/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionInterceptor } from './common/interceptors/rpc.exception.interceptor';
import { AuthGuard } from './common/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user/user.module';
import { AllExceptionsFilter } from './common/filter/exception.filter';

import { DistrictModule } from './modules/organization/district/district.module';

import { RegionModule } from './modules/organization/region/region.module';
import { CityModule } from './modules/organization/city/city.module';
import { OrganizationModule } from './modules/organization/organization/organization.module';
import { GoogleCloudStorageModule } from './modules/file-upload/google-cloud-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [appConfig, serviceConfig, servicesRmqConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    JwtModule.register({
      secret: JwtConfig.secretKey,
    }),
    UserModule,

    // RegionModule,
    // CityModule,
    // DistrictModule,
    // OrganizationModule,
    // GoogleCloudStorageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
