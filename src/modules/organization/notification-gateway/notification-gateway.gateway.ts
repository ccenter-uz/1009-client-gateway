import { Logger, Inject, Injectable, Req } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ORGANIZATION } from 'types/config';
import { ClientProxy } from '@nestjs/microservices';
import * as Config from '../../../common/config/app.config';
import { NotificationServiceCommands as Commands } from 'types/organization/notification/commands';
import {
  NotificationInterfaces,
  NotificationUpdateDto,
  NotificationCreateDto,
} from 'types/organization/notification';
import { DefaultStatus, GetOneDto, StatusEnum } from 'types/global';
import { NotificationFilterDto } from 'types/organization/notification/dto/filter-notification.dto';
import { NotificationService } from '../notification/notification.service';

export type NewApplicationPayload = {
  id: string;
  clientName: string;
  createdAt: Date;
  enabledManagers: string[];
};

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(ORGANIZATION) private readonly adminClient: ClientProxy,
    private readonly notificationService: NotificationService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers['authorization'] as
        | string
        | undefined;
      let organizationId: string = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payload = this.jwtService.verify(token, {
            secret: Config.JwtConfig.secretKey,
          });

          organizationId = payload.organizationId;

          let notification = await this.notificationService.getAll({
            organizationId: +organizationId,
            isRead: false,
            limit: 10,
            page: 1,
            all: true,
            status: StatusEnum.ACTIVE,
          });

          if (notification) {
            client.emit('organization_notification', notification);
            this.logger.debug(
              `Sent notification to client ${client.id} for organization ${organizationId}`
            );
          }
        } catch (e) {
          this.logger.warn('Invalid socket token');
        }
      }
      client.join(`organization:${organizationId}`);

      if (organizationId) {
        client.join(`organization:${organizationId}`);
        this.logger.debug(
          `Client ${client.id} joined organization room ${organizationId}`
        );
      } else {
        this.logger.debug(`Client ${client.id} connected without managerId`);
      }
    } catch (e) {
      this.logger.error('Error on handleConnection', e);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  // emitNewApplication(payload: NewApplicationPayload) {
  //   const { enabledManagers, ...rest } = payload;
  //   if (Array.isArray(enabledManagers) && enabledManagers.length > 0) {
  //     enabledManagers.forEach((managerId) => {
  //       if (!managerId) return;
  //       this.server.to(`manager:${managerId}`).emit('new_application', rest);
  //     });
  //   }
  // }

  emitOrganizationNotification(payload: NotificationInterfaces.Response) {
    if (!payload || !payload.organizationId) {
      this.logger.warn(
        'emitOrganizationNotification called without organizationId'
      );
      return;
    }
    let organizationId = payload.organizationId;
    // 🔹 “organization:{id}” kanaliga emit qilamiz
    this.server
      .to(`organization:${organizationId}`)
      .emit('organization_notification', payload);

    this.logger.debug(
      `Sent 'organization_notification' to organization:${organizationId}`
    );
  }
}
