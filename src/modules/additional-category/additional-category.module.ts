import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { AdditionalCategoryController } from './additional-category.controller';
import { AdditionalCategoryService } from './additional-category.service';

@Module({
  imports: [ClientsModule.registerAsync([initRmqClient(ORGANIZATION)])],
  controllers: [AdditionalCategoryController],
  providers: [AdditionalCategoryService],
})
export class AdditionalCategoryModule {}
