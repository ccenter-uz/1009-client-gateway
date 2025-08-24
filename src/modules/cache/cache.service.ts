import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORGANIZATION } from 'types/config';
import { DeleteDto, GetOneDto, ListQueryDto } from 'types/global';
import {
  CacheInterfaces,
  CacheUpdateDto,
  CacheCreateDto,
  CacheServiceCommands as Commands,
} from 'types/organization/cache';
import { AdditionalFilterDto } from 'types/organization/additional/dto/filter-additional.dto';
import * as Multer from 'multer';
import { MinioService } from '../minio/minio.service';
import { MinioConfig } from 'src/common/config/app.config';
@Injectable()
export class CacheService {
  constructor(
    @Inject(ORGANIZATION) private adminClient: ClientProxy,
    private readonly Minioservice: MinioService
  ) {}



  async getById(data: GetOneDto): Promise<CacheInterfaces.Response> {
    let response = await lastValueFrom(
      this.adminClient.send<CacheInterfaces.Response, GetOneDto>(
        { cmd: Commands.GET_BY_ID },
        data
      )
    );

    return response;
  }

  async create(
    data: CacheCreateDto,
    files: {
      photos?: Multer.File[];
      logo?: Multer.File[];
      banner?: Multer.File[];
    }
  ): Promise<CacheInterfaces.Response> {
    let newPictures;
    if (files?.photos?.length > 0) {
      newPictures = await this.Minioservice.uploadFiles(files?.photos || []);
    }


    let pictures: string[] = [...(data?.data?.pictures ?? []), ...(newPictures ?? [])];

    if(data?.data?.pictures === null){
    pictures = null
    }
    
    let logoLink = data?.data?.logoLink;
    if (files?.logo?.length > 0) {
      let newLogo = await this.Minioservice.uploadFiles(
        files.logo,
        MinioConfig.bucketName
      );

      logoLink = newLogo[0]?.link;

    }

    let bannerLink = data?.data?.bannerLink;
    if (files?.banner?.length > 0) {
      let newBanner = await this.Minioservice.uploadFiles(
        files.banner,
        MinioConfig.bucketName
      );

      bannerLink = newBanner[0]?.link;
    }
    data.data = {
      ...data.data,
      pictures: pictures,
      logoLink: logoLink,
      bannerLink: bannerLink,
    } 

    return await lastValueFrom(
      this.adminClient.send<CacheInterfaces.Response, CacheInterfaces.Request>(
        { cmd: Commands.CREATE },
        data
      )
    );
  }



  async delete(data: DeleteDto): Promise<CacheInterfaces.Response> {
    return lastValueFrom(
      this.adminClient.send<CacheInterfaces.Response, DeleteDto>(
        { cmd: Commands.DELETE },
        data
      )
    );
  }

}
