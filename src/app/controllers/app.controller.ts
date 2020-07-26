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
import { Student } from '../docs/student.response.doc';
import { FileValidatorInterceptor } from '../interceptors/file.interceptor';

@ApiTags('Upload Images')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload-image')
  @UseGuards(MultipartGuard)
  @UseInterceptors(FileInterceptor('imageFile'), FileValidatorInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SaveImage })
  async uploadFile(
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<SavedImage> {
    return this.appService.saveImage(imageFile);
  }

  @Get('get-image-on-local-folder')
  getImage(@Query() image: GetImage): SavedImage {
    return this.appService.getImage(image.imagePath);
  }

  @Get('get-student')
  getStudent(): Student {
    return this.appService.getStudent();
  }
}
