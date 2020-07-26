import { ValidationError } from '@nestjs/common';

export interface HttpExceptionResponse {
  error: string;
  message: string | ValidationError[];
}
