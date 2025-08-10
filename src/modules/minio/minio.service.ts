import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import * as Multer from 'multer';
import * as mime from 'mime-types';
import * as dotenv from 'dotenv';
import { MinioConfig } from '../../common/config/app.config';

dotenv.config();

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client;

  onModuleInit() {
    this.minioClient = new Client({
      endPoint: MinioConfig.host,
      port: MinioConfig.port,
      useSSL: MinioConfig.useSSL,
      accessKey: MinioConfig.accessKey,
      secretKey: MinioConfig.secretKey,
    });
  }

  async upload(bucketName: string = '1009-admin', file: Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const contentType =
      mime.lookup(file.originalname) || 'application/octet-stream';

    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': contentType }
    );

    return `https://${process.env.MINIO_URL}/${bucketName}/${fileName}`;
  }

  async uploadFiles(
    files: Array<Multer.File>,
    bucketName = '1009-admin'
  ): Promise<{ link: string }[]> {
    const uploadedLinks: { link: string }[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const contentType =
        mime.lookup(file.originalname) || 'application/octet-stream';

      await this.minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': contentType }
      );

      uploadedLinks.push({
        link: `https://${process.env.MINIO_URL}/${bucketName}/${fileName}`,
      });
    }

    return uploadedLinks;
  }

  async remove(bucketName: string, fileName: string) {
    await this.minioClient.removeObject(bucketName, fileName);
  }
}
