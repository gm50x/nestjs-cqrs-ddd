import {
  configureCORS,
  configureCompression,
  configureExceptionHandler,
  configureHelmet,
  configureHttpInspectorInbound,
  configureHttpInspectorOutbound,
  configureLogger,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@gedai/nestjs-common';
import { configureContextWrappers } from '@gedai/nestjs-core';
import { INestApplication, Type } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Connection as MongooseConnection } from 'mongoose';
import { setTimeout } from 'timers/promises';
import { environment, rabbitmqURL, virtualHost } from './environment';

export type TestOptions = {
  env?: Record<string, any>;
  silentLogger?: boolean;
};

export async function createTestApp(
  AppModule: Type<any>,
  options?: TestOptions,
) {
  const { env = {}, silentLogger = true } = options ?? {};
  if (silentLogger) {
    env['LOG_SILENT'] = 'true';
  }
  Object.entries({ ...env, ...environment }).forEach(
    ([key, value]) => (process.env[key] = value),
  );
  await axios.put(`${rabbitmqURL}/api/vhosts/${virtualHost}`);
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureContextWrappers(app);
  configureLogger(app);
  configureExceptionHandler(app);
  configureHttpInspectorInbound(app);
  configureHttpInspectorOutbound(app);
  configureCORS(app);
  configureHelmet(app);
  configureCompression(app);
  configureValidation(app);
  configureVersioning(app);
  configureRoutePrefix(app);

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
