import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isArray } from 'class-validator';
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = exception?.message
      ? exception?.message
      : exception?.message || [];
    let jsonError = {};
    if (isArray(errorMessage)) {
      jsonError = errorMessage.map(function (ele) {
        return isJSON(ele) ? JSON.parse(ele) : { message: ele };
      });
    } else {
      jsonError = [
        isJSON(errorMessage)
          ? JSON.parse(errorMessage)
          : { message: errorMessage },
      ];
    }
    if (exception?.response?.message && isArray(exception?.response?.message)) {
      const message = exception?.response?.message;
      jsonError = message.map(function (ele) {
        return isJSON(ele) ? JSON.parse(ele) : { message: ele };
      });
    }
    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      errors: jsonError,
    };

    // const prodErrorResponse: any = {
    //   statusCode,
    //   message,
    // };
    console.log(',[ERROR]', JSON.stringify(devErrorResponse));
    //this.logger.log(`request method: ${request.method} request url${request.url}`, `[ERROR]` + JSON.stringify(devErrorResponse));
    response.status(statusCode).json(
      // configService.get<string>('NODE_ENV', 'development') === 'production'
      //   ? prodErrorResponse
      //   : devErrorResponse,
      devErrorResponse,
    );
  }
}
function isJSON(str) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}
