import { createTestApp as baseCreateTestApp } from '@gedai/test-factory';
import { AppModule } from '../../src/app.module';

export const env = {
  APP_NAME: 'test-nestjs-cqrs-ddd',
  AMQP_EXCHANGE_EVENT_ROOT: 'events',
};

export const createTestApp = (silentLogger: boolean = true) =>
  baseCreateTestApp(AppModule, { env, silentLogger });
