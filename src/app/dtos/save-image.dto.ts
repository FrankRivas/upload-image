import { ApiProperty } from '@nestjs/swagger';

export class SaveImage {
  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: any;
}
