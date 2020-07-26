import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ValidationError,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionResponse } from '../interfaces/http-exception-responce.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let statusCode: number;
    let error: string;
    let message: string | string[] | ValidationError[] | undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as HttpExceptionResponse;
      statusCode = exception.getStatus();
      error = exceptionResponse.error;
      message = exceptionResponse.message || `Invalid Access Token`;
    } else {
      // tslint:disable-next-line: no-console
      console.error(exception);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      if ((exception as Error).message) {
        message = (exception as Error).message;
      }
    }
    if (!Array.isArray(message) && message) {
      message = [message];
    }

    response.status(statusCode).json({ statusCode, error, message });
  }
}
