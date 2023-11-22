import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
class LogExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly httpAdapterHost: HttpAdapterHost) {
    super();
  }

  private log(exception: any) {
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const log = {
      message: exception.message ?? 'Internal Server error',
      error: exception,
    };

    if (statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
      return;
    }

    this.logger.error(log);
  }

  catch(exception: any, host: ArgumentsHost) {
    try {
      this.log(exception);
    } finally {
      super.catch(exception, host);
    }
  }
}

export const configureExceptionsHandler = (app: INestApplication) => {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new LogExceptionFilter(httpAdapter));
  return app;
};
