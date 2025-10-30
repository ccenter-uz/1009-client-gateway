import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './notification-gateway.gateway';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([initRmqClient(ORGANIZATION)]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
    }),
    NotificationModule,
  ],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsGatewayModule {}
