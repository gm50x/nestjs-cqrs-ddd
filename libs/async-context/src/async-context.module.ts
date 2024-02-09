import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncContextMiddleware } from './async-context.middleware';
import { ConfigurableModuleClass } from './async-context.options';
import { AsyncContextService } from './async-context.service';

@Global()
@Module({
  providers: [AsyncContextService],
  exports: [AsyncContextService],
})
export class AsyncContextModule
  extends ConfigurableModuleClass
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncContextMiddleware).forRoutes('*');
  }
}
