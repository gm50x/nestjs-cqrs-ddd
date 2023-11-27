import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { TracingContext } from './tracing.context';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  constructor(private readonly context: TracingContext) {}

  use(req: Request, _res: Response, next: NextFunction) {
    /** TODO: In the future, allow passing these as a config param */
    const traceId =
      req.get('x-trace-id') ??
      req.body?.message?.attributes?.traceId ??
      randomUUID();

    req['traceId'] = traceId;

    const context = new Map();
    context.set('traceId', traceId);

    this.context.run(context, async () => next());
  }
}
