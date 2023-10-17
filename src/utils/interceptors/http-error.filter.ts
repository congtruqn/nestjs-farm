import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RabbitConfigService } from 'src/infrastructure/config/rabbitmq/rabbitmq.service';
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor(private readonly rabbitConfig: RabbitConfigService) {
    this.logger = new Logger();
  }
  async catch(exception: any, host: ArgumentsHost) {
    const now = Date.now();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { Header } = request;

    const message =
      exception instanceof HttpException
        ? exception.message || exception.message
        : 'Internal server error';

    const data = {
      Header,
      data: null,
      respCode: 'ERROR',
      error: message,
      errorDetail: message,
    };

    const devErrorResponse: any = {
      ...data,
      duration: `${Date.now() - now}ms`,
    };

    console.log('[MESSAGE-ERROR]', JSON.stringify(devErrorResponse));

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json(devErrorResponse);
  }
}
