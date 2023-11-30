import { faker } from '@faker-js/faker';
import {
  configureCORS,
  configureCompression,
  configureExceptionsHandler,
  configureHelmet,
  configureLogger,
  configureOpenAPI,
  configureValidation,
  configureVersioning,
} from '@gedai/config';
import { HttpServer, INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection as MongooseConnection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configureLogger(app, true);
    configureCORS(app);
    configureCompression(app);
    configureExceptionsHandler(app);
    configureHelmet(app);
    configureOpenAPI(app);
    configureValidation(app);
    configureVersioning(app);

    await app.init();
  });

  beforeEach(() => {
    server = app.getHttpServer();
  });

  afterAll(async () => {
    // TODO: This should work with typeorm too
    const mongooseConnection =
      app.get<MongooseConnection>(getConnectionToken());
    await mongooseConnection.dropDatabase();
    await app.close();
  });

  describe('accounts', () => {
    it('POST /v1/sign-up should accept sign-ups of new accounts', async () => {
      const fullName = faker.person.fullName();
      const [firstName, ...lastNames] = fullName.split(' ');
      const response = await request(server)
        .post('/v1/sign-up')
        .send({
          name: fullName,
          email: faker.internet.email({
            firstName,
            lastName: lastNames.join('_'),
          }),
          password: faker.internet.password(),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('POST /v1/sign-in should accept return an access_token', async () => {
      const fullName = faker.person.fullName();
      const [firstName, ...lastNames] = fullName.split(' ');
      const password = faker.internet.password();
      const email = faker.internet.email({
        firstName,
        lastName: lastNames.join('_'),
      });
      await request(server)
        .post('/v1/sign-up')
        .send({ name: fullName, email, password });
      const response = await request(server)
        .post('/v1/sign-in')
        .send({ email, password });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ access_token: expect.any(String) });
    });
  });
});
