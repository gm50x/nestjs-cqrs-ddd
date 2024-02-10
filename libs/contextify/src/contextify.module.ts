import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContextifyMiddleware } from './contextify.middleware';
import { ConfigurableModuleClass } from './contextify.options';
import { ContextifyService } from './contextify.service';

@Global()
@Module({
  providers: [ContextifyService],
  exports: [ContextifyService],
})
export class ContextifyModule
  extends ConfigurableModuleClass
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextifyMiddleware).forRoutes('*');
  }
}
