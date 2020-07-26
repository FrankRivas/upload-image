// tslint:disable: variable-name
import { Injectable } from '@nestjs/common';
import { SavedImage } from '../docs/image.response.doc';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as cryptoRandomString from 'crypto-random-string';
import * as streamifier from 'streamifier';
import * as cloudinary from 'cloudinary';
import { Student } from '../docs/student.response.doc';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  saveImageOnLocalFolder(imageFile: Express.Multer.File): SavedImage {
    const imageFormat = imageFile.mimetype.split('/')[1];
    const base64Image = imageFile.buffer.toString('base64');
    const imagePath = `${this.configService.get<string>(
      'DIRECTORY_PATH',
    )}student-profile-image-${cryptoRandomString({
      length: 10,
      type: 'numeric',
    })}.${imageFormat}`;
    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, error => {
      console.log('File created');
    });
    return {
      path: imagePath,
    };
  }

  async saveImageOnCloudinary(
    imageFile: Express.Multer.File,
  ): Promise<SavedImage> {
    const imageId = `student-profiles/student-profile-image-${cryptoRandomString(
      {
        length: 10,
        type: 'numeric',
      },
    )}`;
    let imagePath = '';
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
    await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.v2.uploader.upload_stream(
        { tags: 'student_image_profile', public_id: imageId },
        (err, image) => {
          if (err) {
            reject(err);
          }
          imagePath = image.url;
          resolve(image);
        },
      );
      streamifier.createReadStream(imageFile.buffer).pipe(upload_stream);
    });
    return {
      path: imagePath,
    };
  }

  async saveImage(imageFile: Express.Multer.File): Promise<SavedImage> {
    const excludedEnvs = this.configService
      .get<string>('EXCLUDED_ENVS')
      .split(',');
    const env = this.configService.get<string>('ENV');
    if (excludedEnvs.includes(env)) {
      return this.saveImageOnCloudinary(imageFile);
    }
    return this.saveImageOnLocalFolder(imageFile);
  }

  getImage(imagePath: string): SavedImage {
    const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
    return {
      path: imageAsBase64,
    };
  }

  getStudent(): Student {
    const student = {
      name: 'John',
      lastname: 'Doe',
      email: 'example@example.com',
      photo: 'image.png',
    };
    const excludedEnvs = this.configService
      .get<string>('EXCLUDED_ENVS')
      .split(',');
    const env = this.configService.get<string>('ENV');
    if (!excludedEnvs.includes(env)) {
      student.photo = fs.readFileSync(student.photo, 'base64');
    }
    return student;
  }
}
