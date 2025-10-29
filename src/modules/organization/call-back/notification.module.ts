import { Module } from '@nestjs/common';
import { OrganizationEventsListener } from './notification.controller';
// import { NotificationService } from './notification.service';
// import { RegionModule } from '../region/region.module';

@Module({
  imports: [],
  controllers: [OrganizationEventsListener],
  providers: [],
  exports: [],
})
export class OrganizationEventsListenerModule {}
