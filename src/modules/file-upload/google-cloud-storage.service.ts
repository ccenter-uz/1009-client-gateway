import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import { keyFilename } from 'src/common/config/app.config';
import { extname, join } from 'path';
import { v4 } from 'uuid';
import { Storage, Bucket } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageService {
  private readonly storage: Storage;
  private readonly bucketName = 'telecom2003';
  private readonly bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      keyFilename: keyFilename,
    });
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async upload(file: any | any[]): Promise<string> {
    const a: any[] = [];
    a.push(file);
    const imageLink = join(v4() + extname(a[0]?.originalname));
    const blob = this.bucket.file(imageLink);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {});

    blobStream.end(a[0]?.buffer);
    return imageLink;
  }

  async uploadFiles(files: Array<Multer.File>): Promise<{ link: string }[]> {
    const uploadedLinks: { link: string }[] = [];

    for (const file of files) {
      const imageLink = join(v4() + extname(file.originalname));
      const blob = this.bucket.file(imageLink);
      const blobStream = blob.createWriteStream();

      await new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.error('Blob stream error:', err);
          reject(err); // Add this in your Promise block
        });

        blobStream.on('finish', () => {
          resolve(true);
        });

        blobStream.end(file.buffer);
      });

      uploadedLinks.push({
        link: `https://storage.googleapis.com/${this.bucketName}/${imageLink}`,
      });
    }

    return uploadedLinks;
  }
}
// export class GoogleCloudStorageService {
//   private readonly storage: Storage;
//   private readonly bucketName = 'telecom2003';

//   constructor() {
//     this.storage = new Storage({
//       keyFilename: keyFilename,
//     });
//   }

//   async uploadFile(file: Multer.File): Promise<string> {
//     try {
//
//

//       const bucket = this.storage.bucket(this.bucketName);
//       const fileName = `${this.bucketName}/${Date.now()}_${file.originalname}`;
//       const blob = bucket.file(fileName);
//

//       const a = await blob.save(file.buffer, {
//         metadata: { contentType: file.mimetype },
//       });
//

//       // Make the file public (optional)
//       await blob.makePublic();

//       return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
// } catch (error) {
//
//   throw error

// }
//   }

//   async uploadMultipleFiles(
//     files: Multer.File[],
//   ): Promise<string[]> {
//

//     const uploadPromises = files.map((file) => this.uploadFile(file));
//     return Promise.all(uploadPromises);
//   }
// }
// export class FileUploadService {
//   private logger = new Logger(FileUploadService.name);
//   constructor() {}

//   async upload(file: any | any[]): Promise<string> {
//     const a: any[] = [];
//     a.push(file);
//     const imageLink = join(v4() + extname(a[0]?.originalname));
//     const blob = bucket.file(imageLink);
//     const blobStream = blob.createWriteStream();

//     blobStream.on('error', (err) => {});

//     blobStream.end(a[0]?.buffer);
//     return imageLink;
//   }

//   async uploadFiles(files: Array<Multer.File>): Promise<{ link: string }[]> {
//     const uploadedLinks: { link: string }[] = [];

//     for (const file of files) {

//       const imageLink = join(v4() + extname(file.originalname));
//       const blob = bucket.file(imageLink);
//       const blobStream = blob.createWriteStream();

//       await new Promise((resolve, reject) => {
//         blobStream.on('error', (err) => {
//           console.error('Blob stream error:', err);
//           reject(err); // Add this in your Promise block
//         });

//         blobStream.on('finish', () => {
//           resolve(true);
//         });

//         blobStream.end(file.buffer);
//       });

//       uploadedLinks.push({ link: imageLink });
//     }

//     return uploadedLinks;
//   }
// }
