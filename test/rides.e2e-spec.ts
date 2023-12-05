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
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import * as request from 'supertest';
import { setTimeout } from 'timers/promises';
import { AppModule } from '../src/app.module';
import { getPassengerAccount } from './utils';

describe('Rides (e2e)', () => {
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
    await setTimeout(500);
    // TODO: This should work with typeorm too
    // const mongooseConnection =
    //   app.get<MongooseConnection>(getConnectionToken());
    // await mongooseConnection.dropDatabase();
    await app.close();
  });

  describe('rides', () => {
    it('POST /v1/request-ride should create a new ride for passenger and return the ride id', async () => {
      const passenger = getPassengerAccount();
      const createPassengerResponse = await request(server)
        .post('/v1/sign-up')
        .send(passenger);
      const passengerId = createPassengerResponse.body.id;
      const requestRideResponse = await request(server)
        .post('/v1/request-ride')
        .send({
          passengerId,
          from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
          },
          to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
          },
        });
      expect(requestRideResponse.statusCode).toBe(201);
      expect(requestRideResponse.body.id).toEqual(expect.any(String));
    });
    it('POST /v1/request-ride should fail creating a new ride if passenger does not exist', async () => {
      const requestRideResponse = await request(server)
        .post('/v1/request-ride')
        .send({
          passengerId: new Types.ObjectId().toHexString(),
          from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
          },
          to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
          },
        });
      expect(requestRideResponse.statusCode).toBe(422);
    });
    it('POST /v1/request-ride should fail creating a new ride if passenger already has an active ride', async () => {
      const passenger = getPassengerAccount();
      const createPassengerResponse = await request(server)
        .post('/v1/sign-up')
        .send(passenger);
      const passengerId = createPassengerResponse.body.id;
      await request(server)
        .post('/v1/request-ride')
        .send({
          passengerId,
          from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
          },
          to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
          },
        });
      const secondRideResponse = await request(server)
        .post('/v1/request-ride')
        .send({
          passengerId,
          from: {
            lat: -27.584905257808835,
            long: -48.545022195325124,
          },
          to: {
            lat: -27.496887588317275,
            long: -48.522234807851476,
          },
        });
      expect(secondRideResponse.statusCode).toBe(409);
    });
  });
});
