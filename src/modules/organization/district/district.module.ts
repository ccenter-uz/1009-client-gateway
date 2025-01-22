import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
  imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
