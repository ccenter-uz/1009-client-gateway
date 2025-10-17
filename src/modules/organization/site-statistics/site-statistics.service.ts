import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NominatimService } from 'src/modules/nominatim/nominatim.service';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto, Regions } from 'types/global';
import {
  siteStatisticsCommands as Commands,
  siteStatisticsCreateDto,
  siteStatisticsInterfaces,
  siteStatisticsFilterDto,
} from 'types/organization/site-statistics';

@Injectable()
export class SiteStatisticsService {
  constructor(
    @Inject(ORGANIZATION) private adminClient: ClientProxy,
    private readonly nominatimService: NominatimService
  ) {}

  async getById(data: GetOneDto): Promise<siteStatisticsInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<siteStatisticsInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );
  }

  async create(
    data: siteStatisticsCreateDto
  ): Promise<siteStatisticsInterfaces.Response> {
    const findRegion = await this.nominatimService.reverse({
      lat: String(data.address[0]),
      lon: String(data.address[1]),
    });

    let region = null;

    if (findRegion && findRegion.address.city) {
      region = findRegion.address.city;
    } else if (findRegion && findRegion.address.state) {
      region = findRegion.address.state;
    }

    if (region) {
      const lowerRegion = region.toLowerCase();
      const matched = Regions.find((r) => lowerRegion.includes(r));

      if (matched) {
        region = matched;
      } else {
        region = 'toshkent';
      }
    }

    data.addressCity = region;

    return await lastValueFrom(
      this.adminClient.send<
        siteStatisticsInterfaces.Response,
        siteStatisticsInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }
}
