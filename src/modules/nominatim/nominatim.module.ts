import { Module, Global } from '@nestjs/common';
import { NominatimService } from './nominatim.service';
import { NominatimController } from './nominatim.controller';

@Global()
@Module({
  providers: [NominatimService],
  controllers: [NominatimController],
  exports: [NominatimService],
})
export class NominatimModule {}
