import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { initRmqClient, ORGANIZATION } from 'types/config';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    ClientsModule.registerAsync([initRmqClient(ORGANIZATION)]),
    MinioModule,
  ],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
