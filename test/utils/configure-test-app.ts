import {
  configureAmqpAuditInterceptor,
  configureCORS,
  configureCompression,
  configureContextInterceptor,
  configureExceptionsHandler,
  configureLogger,
  configureOpenAPI,
  configureOutboundHttpTracing,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@gedai/config';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Connection as MongooseConnection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { env, rabbitmqURL, virtualHost } from './environment';

Object.entries(env).forEach(([key, value]) => (process.env[key] = value));

type TestOptions = {
  silentLogger?: boolean;
};

export async function createTestApp(options?: TestOptions) {
  const { silentLogger = true } = options ?? {};
  await axios.put(`${rabbitmqURL}/api/vhosts/${virtualHost}`);
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureLogger(app, silentLogger);
  configureCORS(app);
  configureCompression(app);
  configureExceptionsHandler(app);
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

export async function destroyTestApp(app: INestApplication) {
  const mongooseConnection = app.get<MongooseConnection>(getConnectionToken());
  await Promise.all([
    axios.delete(`${rabbitmqURL}/api/vhosts/${virtualHost}`),
    mongooseConnection.dropDatabase(),
  ]);
  await app.close();
}
