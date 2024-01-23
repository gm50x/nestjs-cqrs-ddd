import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextModuleOptions, MODULE_OPTIONS_TOKEN } from './context.options';
import { ContextService } from './context.service';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(
    private readonly context: ContextService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ContextModuleOptions,
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
            complete: () => subscriber.complete(),
            error: (e) => {
              e.context = store;
              return subscriber.error(e);
            },
          }),
      );
    });
  }
}