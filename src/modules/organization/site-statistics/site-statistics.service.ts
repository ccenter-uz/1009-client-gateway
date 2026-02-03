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
  GetSiteStatisticsDto,
} from 'types/organization/site-statistics';

@Injectable()
export class SiteStatisticsService {
  constructor(
    @Inject(ORGANIZATION) private adminClient: ClientProxy,
    private readonly nominatimService: NominatimService
  ) {}

  async getById(
    id: number,
    data: GetSiteStatisticsDto
  ): Promise<siteStatisticsInterfaces.Response> {
    data.id = id;

    return lastValueFrom(
      this.adminClient.send<
        siteStatisticsInterfaces.Response,
        GetSiteStatisticsDto
      >({ cmd: Commands.GET_BY_ID }, data)
    );
  }

  async create(
    data: siteStatisticsCreateDto
  ): Promise<siteStatisticsInterfaces.Response> {
    let region: string | null = null;

    // 1️⃣ GPS orqali aniqlash
    if (
      Array.isArray(data.address) &&
      data.address.length === 2 &&
      data.address[0] &&
      data.address[1]
    ) {
      const findRegion = await this.nominatimService.reverse({
        lat: String(data.address[0]),
        lon: String(data.address[1]),
      });

      if (findRegion?.address?.city) {
        region = findRegion.address.city;
      } else if (findRegion?.address?.state) {
        region = findRegion.address.state;
      }
    }

    // 2️⃣ Agar GPS bermasa → IP orqali
    if (!region && data.ip) {
      try {
        const res = await fetch(`https://ipwho.is/${data.ip}`);
        const geo: any = await res.json();

        if (geo.success) {
          region = geo.region || geo.city || null;
        } else {
          region = null;
        }
      } catch (e) {
        console.log(e.message);
        region = null;
      }
    }

    if (region) {
      const lowerRegion = region.toLowerCase();
      const matched = Regions.find((r) => lowerRegion.includes(r));

      region = matched || 'toshkent';
    }

    data.addressCity = region || 'toshkent';

    return await lastValueFrom(
      this.adminClient.send<
        siteStatisticsInterfaces.Response,
        siteStatisticsInterfaces.Request
      >({ cmd: Commands.CREATE }, data)
    );
  }
}
