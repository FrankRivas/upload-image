import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class SavedImage {
  @Expose()
  @ApiProperty()
  path: string;
}
