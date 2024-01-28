import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContextMiddleware } from './context.middleware';
import { ConfigurableModuleClass } from './context.options';
import { ContextService } from './context.service';

@Global()
@Module({
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule
  extends ConfigurableModuleClass
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
