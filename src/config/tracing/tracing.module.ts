import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TracingContext } from './tracing.context';
import { TracingMiddleware } from './tracing.middleware';
import { TracingService } from './tracing.service';

@Global()
@Module({
  providers: [
    TracingService,
    {
      provide: TracingContext,
      useValue: TracingContext.getContext(),
    },
  ],
  exports: [TracingService],
})
export class TracingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracingMiddleware).forRoutes('*');
  }
}
