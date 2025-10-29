import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as Config from '../../../common/config/app.config';

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

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      // Expect Authorization: Bearer <token>
      const authHeader = client.handshake.headers['authorization'] as
        | string
        | undefined;
      let userId: string = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          console.log(token);

          const payload = this.jwtService.verify(token, {
            secret: Config.JwtConfig.secretKey,
          });

          console.log(payload);
          userId = payload.userId;
        } catch (e) {
          this.logger.warn('Invalid socket token');
        }
      }
      console.log('okkk');
      client.join(`manager:${userId}`);

      if (userId) {
        client.join(`manager:${userId}`);
        this.logger.debug(`Client ${client.id} joined manager room ${userId}`);
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

  emitNewApplication(payload: NewApplicationPayload) {
    const { enabledManagers, ...rest } = payload;
    if (Array.isArray(enabledManagers) && enabledManagers.length > 0) {
      enabledManagers.forEach((managerId) => {
        if (!managerId) return;
        this.server.to(`manager:${managerId}`).emit('new_application', rest);
      });
    }
  }
}
