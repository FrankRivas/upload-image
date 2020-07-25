import { Injectable } from '@nestjs/common';
import { SavedImage } from '../docs/image.response.doc';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as cryptoRandomString from 'crypto-random-string';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  saveImage(imageFile: Express.Multer.File): SavedImage {
    const base64Image = imageFile.buffer.toString('base64');
    const imagePath = `${this.configService.get<string>(
      'DIRECTORY_PATH',
    )}student-profile-image-${cryptoRandomString({
      length: 10,
      type: 'numeric',
    })}.png`;
    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, error => {
      console.log('File created');
    });
    return {
      path: imagePath,
    };
  }

  getImage(imagePath: string): SavedImage {
    const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
    return {
      path: imageAsBase64,
    };
  }
}
