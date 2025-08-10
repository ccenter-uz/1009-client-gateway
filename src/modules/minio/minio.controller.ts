import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import * as Multer from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('uploadFiles')
  @ApiOperation({ summary: 'Upload a file to MinIO' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Multer.File[]) {
    const bucketName = 'test';
    const urls = await this.minioService.uploadFiles( files , bucketName);
    return { urls };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file to MinIO' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(@UploadedFile() file: Multer.File) {
    const bucketName = 'test';
    const url = await this.minioService.upload(bucketName, file);
    return { url };
  }

  // Generate a pre-signed URL to access a file
  @Get('file-url/:fileName')
  @ApiOperation({ summary: 'Get MinIO file URL' })
  @ApiParam({
    name: 'fileName',
    required: true,
    description: 'Name of the file',
  })
  @ApiResponse({ status: 200, description: 'File URL retrieved successfully' })
  async getFileUrl(@Param('fileName') fileName: string) {
    return {
      url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/test-files/${fileName}`,
    };
  }

  // Delete a file from MinIO
  @Delete('delete/:fileName')
  @ApiOperation({ summary: 'Delete a file from MinIO' })
  @ApiParam({
    name: 'fileName',
    required: true,
    description: 'Name of the file',
  })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('fileName') fileName: string) {
    await this.minioService.remove('test-files', fileName);
    return { message: `File ${fileName} deleted successfully` };
  }
}
