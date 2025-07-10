import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { SavedOrganizationController } from './saved-organization.controller';
import { SavedOrganizationService } from './saved-organization.service';

@Module({
  imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  controllers: [SavedOrganizationController],
  providers: [SavedOrganizationService],
})
export class SavedOrganizationModule {}
