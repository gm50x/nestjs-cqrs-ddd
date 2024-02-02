import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ContextModuleOptions, MODULE_OPTIONS_TOKEN } from './context.options';
import { ContextService } from './context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly context: ContextService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ContextModuleOptions,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Setting up context storage');
    const { middlewareSetup: mountMiddleware } = this.options;
    const store = this.context.getStore();
    mountMiddleware(store, req);
    this.context.run(store, async () => next());
    res.on('finish', () => {
      this.context.destroy();
      this.logger.debug('Context cleared');
    });
  }
}
