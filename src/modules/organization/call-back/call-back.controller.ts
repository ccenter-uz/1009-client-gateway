// client-gateway/src/organization-events.listener.ts
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsGateway } from '../notification-gateway/notification-gateway.gateway';
import { NotificationInterfaces } from 'types/organization/notification';
// import { OrganizationCreatedV1 } from '../shared/contracts/organization-events';

@Controller()
export class OrganizationEventsListener {
  private readonly logger = new Logger(OrganizationEventsListener.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  // Bind this queue to the routing key(s) you need in RabbitMQ (Nest does this for you)
  @EventPattern('notification.created')
  async handleOrganizationCreated(
    @Payload() payload: NotificationInterfaces.Response,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.notificationsGateway.emitOrganizationNotification(payload);
      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(err);

      // Option A: Nack & requeue (risk of poison messages)
      // channel.nack(originalMsg, false, true);

      // Option B (recommended): Nack & reject to DLQ
      channel.nack(originalMsg, false, false);
    }
  }
}
