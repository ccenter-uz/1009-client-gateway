import { Module } from '@nestjs/common';

import { GoogleCloudStorageService } from './google-cloud-storage.service';

@Module({
  //   imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  //   controllers: [OrganizationController],
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService],
})
export class GoogleCloudStorageModule {}
