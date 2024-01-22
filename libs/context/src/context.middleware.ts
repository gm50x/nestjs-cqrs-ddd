import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ContextModuleOptions, MODULE_OPTIONS_TOKEN } from './context.options';
import { ContextService } from './context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly context: ContextService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ContextModuleOptions,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const { middlewareSetup: mountMiddleware } = this.options;
    const store = this.context.getStore();
    mountMiddleware(store, req);
    this.context.run(store, async () => next());
  }
}
