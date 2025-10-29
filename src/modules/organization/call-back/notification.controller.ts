// client-gateway/src/organization-events.listener.ts
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
// import { OrganizationCreatedV1 } from '../shared/contracts/organization-events';

@Controller()
export class OrganizationEventsListener {
  private readonly logger = new Logger(OrganizationEventsListener.name);

  // Bind this queue to the routing key(s) you need in RabbitMQ (Nest does this for you)
  @EventPattern('organizationv1')
  async handleOrganizationCreated(
    @Payload() payload: any,
    @Ctx() context: RmqContext
  ) {
    console.log('event keldii');
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Received organization.created.v1: ${payload.data.id}`);

      // 1) Idempotency: ensure we process `eventId` only once
      // e.g., check Redis set "processed:eventId" before continuing

      // 2) Perform whatever you need:
      // - push to WebSocket
      // - cache warmup
      // - fan-out to other internal handlers

      // ACK only after success
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
