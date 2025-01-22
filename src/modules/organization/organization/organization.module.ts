import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { GoogleCloudStorageModule } from 'src/modules/file-upload/google-cloud-storage.module';

@Module({
  imports: [
    ClientsModule.registerAsync([initRmqClient(ORGANIZATION)]),
    GoogleCloudStorageModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
