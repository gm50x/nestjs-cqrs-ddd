import { configureAmqpAuditInterceptor } from '@gedai/amqp';
import {
  configureCORS,
  configureCompression,
  configureContextInterceptor,
  configureExceptionsHandler,
  configureHttpAuditInterceptor,
  configureLogger,
  configureOpenAPI,
  configureOutboundHttpTracing,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@gedai/common';
import { INestApplication, Type } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Connection as MongooseConnection } from 'mongoose';
import { setTimeout } from 'timers/promises';
import { environment, rabbitmqURL, virtualHost } from './environment';

export type TestOptions = {
  silentLogger?: boolean;
  env?: Record<string, any>;
};

export async function createTestApp(
  AppModule: Type<any>,
  options?: TestOptions,
) {
  const { silentLogger = true, env = {} } = options ?? {};
  Object.entries({ ...env, ...environment }).forEach(
    ([key, value]) => (process.env[key] = value),
  );
  await axios.put(`${rabbitmqURL}/api/vhosts/${virtualHost}`);
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureLogger(app, { silent: silentLogger });
  configureCORS(app);
  configureCompression(app);
  configureExceptionsHandler(app);
  configureHttpAuditInterceptor(app);
  configureAmqpAuditInterceptor(app);
  configureContextInterceptor(app);
  configureOpenAPI(app);
  configureValidation(app);
  configureVersioning(app);
  configureRoutePrefix(app);
  configureOutboundHttpTracing(app);

  await app.init();
  return app;
}

const gracefulClosePeriod = () => setTimeout(250);

export async function destroyTestApp(app: INestApplication) {
  const mongooseConnection = await app
    .resolve<MongooseConnection>(getConnectionToken())
    .catch(() => null);
  await mongooseConnection?.dropDatabase();
  await axios.delete(`${rabbitmqURL}/api/vhosts/${virtualHost}`);
  await gracefulClosePeriod();
  await app.close();
}
