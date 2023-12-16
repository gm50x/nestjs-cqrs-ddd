import { AmqpAuditInterceptor } from '@gedai/audit';
import { AmqpTracingInterceptor } from '@gedai/tracing';
import { INestApplication, Logger } from '@nestjs/common';

export const configureAmqpAuditInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(
    new AmqpTracingInterceptor(),
    new AmqpAuditInterceptor(),
  );
  Logger.log('AMQP Audit Interceptor initialized', 'Configuration');
  return app;
};
