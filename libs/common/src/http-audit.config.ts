import {
  INestApplication,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpAuditMiddleware implements NestMiddleware {
  private logger = new Logger(this.constructor.name);

  private getLogLevel(res: Response) {
    const statusCode = res.statusCode;
    if (statusCode >= 500) {
      return 'error';
    }
    if (statusCode >= 400) {
      return 'warn';
    }
    return 'log';
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTimestamp = Date.now();
    let responseBody = null;
    const originalSend = res.send;
    res.send = (body) => {
      if (!responseBody) {
        responseBody = body;
      }
      res.send = originalSend;
      return res.send(body);
    };

    const originalJson = res.json;
    res.json = (body) => {
      if (!responseBody) {
        responseBody = body;
      }
      res.json = originalJson;
      return res.json(body);
    };

    res.on('finish', () => {
      const logLevel = this.getLogLevel(res);
      this.logger[logLevel]({
        message: 'REQUEST AUDIT',
        totalTime: `${Date.now() - startTimestamp}ms`,
        request: {
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          body: req.body,
          query: req.query,
        },
        response: {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.getHeaders(),
          body: responseBody,
        },
      });
    });

    next();
  }
}

export const configureHttpAuditInterceptor = (app: INestApplication) => {
  const httpRequestLogger = new HttpAuditMiddleware();
  app.use(httpRequestLogger.use.bind(httpRequestLogger));
  Logger.log('AMQP Audit Interceptor initialized', 'Configuration');
  return app;
};
