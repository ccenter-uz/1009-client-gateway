import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
