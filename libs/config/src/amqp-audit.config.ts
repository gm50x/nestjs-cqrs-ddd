import { AmqpAuditInterceptor } from '@gedai/audit';
import { INestApplication, Logger } from '@nestjs/common';

export const configureAmqpAuditInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(new AmqpAuditInterceptor());
  Logger.log('AMQP Audit Interceptor initialized', 'Configuration');
  return app;
};
