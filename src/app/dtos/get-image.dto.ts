import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class GetImage {
  @ApiProperty()
  @Expose()
  imagePath: string;
}
