import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { HttpAuditMiddleware } from './http-audit.middleware';

@Global()
@Module({})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpAuditMiddleware).forRoutes('*');
  }
}
