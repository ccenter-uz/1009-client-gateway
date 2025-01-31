import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { AdditionalController } from './additional.controller';
import { AdditionalService } from './additional.service';

@Module({
  imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  controllers: [AdditionalController],
  providers: [AdditionalService],
})
export class AdditionalModule {}
