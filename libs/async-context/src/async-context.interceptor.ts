import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AsyncContextModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './async-context.options';
import { AsyncContextService } from './async-context.service';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly context: AsyncContextService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: AsyncContextModuleOptions,
  ) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const contextType = executionContext.getType<ContextType>();
    const ignoredContextTypesWithMiddlewares: ContextType[] = [
      'http',
      // TODO: add other context types to allow tracing when used (eg.: graphql, ws over http)
    ];
    if (ignoredContextTypesWithMiddlewares.includes(contextType)) {
      return next.handle();
    }
    this.logger.debug('Setting up context storage');
    const { interceptorSetup } = this.options;
    const store = this.context.getStore();
    interceptorSetup(store, executionContext);
    return new Observable((subscriber) => {
      this.context.run(store, async () =>
        next
          .handle()
          .pipe()
          .subscribe({
            next: (d) => subscriber.next(d),
            complete: () => {
              this.context.destroy();
              return subscriber.complete();
            },
            error: (e) => {
              e.context = new Map(store);
              this.context.destroy();
              this.logger.debug('Context cleared');
              return subscriber.error(e);
            },
          }),
      );
    });
  }
}
