import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuditMiddleware } from './audit.middleware';

@Global()
@Module({})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*');
  }
}
