import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  private logger = new Logger(this.constructor.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, headers, body, originalUrl: url } = req;
    this.logger.log({
      message: 'REQUEST AUDIT',
      request: { method, url, headers, body },
    });

    let responseBody = null;
    const originalSend = res.send;
    res.send = (body) => {
      res.send = originalSend;
      responseBody = body;
      return res.send(body);
    };

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const headers = res.getHeaders();
      this.logger.log({
        message: 'RESPONSE AUDIT',
        response: {
          statusCode,
          statusMessage,
          headers,
          body: responseBody,
        },
      });
    });

    next();
  }
}
