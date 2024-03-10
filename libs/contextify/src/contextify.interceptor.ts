import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ContextifyModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './contextify.options';
import { ContextifyService } from './contextify.service';

@Injectable()
export class ContextifyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly context: ContextifyService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ContextifyModuleOptions,
  ) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (this.context.isActive()) {
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
              this.logger.debug('Context was cleared');
              return subscriber.error(e);
            },
          }),
      );
    });
  }
}
