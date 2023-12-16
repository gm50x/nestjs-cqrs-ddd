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
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from '../../src/app.module';

const dbName = randomUUID().split('-').at(0);
process.env.MONGO_URL = `mongodb://gedai:gedai@localhost:27017/${dbName}?authSource=admin`;
process.env.AMQP_URL = `amqp://gedai:gedai@localhost:5672`;

export async function createTestApp(silentLogger = true) {
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
