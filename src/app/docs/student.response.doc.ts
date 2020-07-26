import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class Student {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  photo: string;
}
