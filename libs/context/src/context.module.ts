import {
  Controller,
  Get,
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ContextMiddleware } from './context.middleware';
import { ConfigurableModuleClass } from './context.options';
import { ContextService } from './context.service';

@Controller()
export class FakeController {
  private readonly logger = new Logger(this.constructor.name);
  @Get('hello')
  getHello() {
    this.logger.log('Hello, World!');
    return 'all good';
  }
}

@Global()
@Module({
  providers: [ContextService],
  controllers: [FakeController],
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
