import {
  configureAmqpAuditInterceptor,
  configureCORS,
  configureCompression,
  configureExceptionsHandler,
  configureLogger,
  configureOpenAPI,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@gedai/config';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Connection as MongooseConnection } from 'mongoose';
import { AppModule } from '../../src/app.module';

const basicBearer = `gedai:gedai`;
const virtualHost = randomUUID().split('-').at(0);
process.env.MONGO_URL = `mongodb://${basicBearer}@localhost:27017/${virtualHost}?authSource=admin`;
process.env.AMQP_URL = `amqp://${basicBearer}@localhost:5672/${virtualHost}`;
const rabbitmqURL = `http://${basicBearer}@localhost:15672`;

export async function createTestApp(silentLogger = true) {
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
  configureOpenAPI(app);
  configureValidation(app);
  configureVersioning(app);
  configureRoutePrefix(app);
  return app;
}

export async function teardownTestApp(app: INestApplication) {
  const mongooseConnection = app.get<MongooseConnection>(getConnectionToken());
  await Promise.all([
    axios.delete(`${rabbitmqURL}/api/vhosts/${virtualHost}`),
    mongooseConnection.dropDatabase(),
  ]);
  await app.close();
}
