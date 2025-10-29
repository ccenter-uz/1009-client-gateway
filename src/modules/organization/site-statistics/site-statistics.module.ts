import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { SiteStatisticsController } from './site-statistics.controller';
import { SiteStatisticsService } from './site-statistics.service';
import { NominatimModule } from 'src/modules/nominatim/nominatim.module';

@Module({
  imports: [
    ClientsModule.registerAsync([initRmqClient(ORGANIZATION)]),
    NominatimModule,
  ],
  controllers: [SiteStatisticsController],
  providers: [SiteStatisticsService],
})
export class SiteStatisticsModule {}
