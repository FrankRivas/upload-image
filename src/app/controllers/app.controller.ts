import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SavedImage } from '../docs/image.response.doc';
import { MultipartGuard } from '../guards/multipart.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SaveImage } from '../dtos/save-image.dto';
import { GetImage } from '../dtos/get-image.dto';

@ApiTags('Upload Images')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload-image')
  @UseGuards(MultipartGuard)
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SaveImage })
  uploadFile(@UploadedFile() imageFile: Express.Multer.File): SavedImage {
    return this.appService.saveImage(imageFile);
  }

  @Get('get-image')
  getImage(@Query() image: GetImage): SavedImage {
    return this.appService.getImage(image.imagePath);
  }
}
