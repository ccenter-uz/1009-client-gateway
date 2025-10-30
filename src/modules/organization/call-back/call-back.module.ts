import { Module } from '@nestjs/common';
import { OrganizationEventsListener } from './call-back.controller';
import { NotificationsGatewayModule } from '../notification-gateway/notifications-gateway.module';
// import { NotificationService } from './notification.service';
// import { RegionModule } from '../region/region.module';

@Module({
  imports: [NotificationsGatewayModule],
  controllers: [OrganizationEventsListener],
  providers: [],
  exports: [],
})
export class CallBackModule {}
