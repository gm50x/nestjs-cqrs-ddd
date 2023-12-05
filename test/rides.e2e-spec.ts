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
import { getDriverAccount, getPassengerAccount, getRequestRide } from './utils';

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

  describe('Ride', () => {
    describe('Request Ride', () => {
      it('POST /v1/request-ride should create a new ride for passenger and return the ride id', async () => {
        const passenger = getPassengerAccount();
        const createPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(passenger);
        const passengerId = createPassengerResponse.body.id;
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        const rideId = requestRideResponse.body.id;
        const getRideResponse = await request(server).get(
          `/v1/rides/${rideId}`,
        );
        expect(requestRideResponse.statusCode).toBe(201);
        expect(rideId).toEqual(expect.any(String));
        expect(getRideResponse.body).toEqual(
          expect.objectContaining({
            status: 'REQUESTED',
            passenger: expect.objectContaining({ id: passengerId }),
          }),
        );
      });
      it('POST /v1/request-ride should fail creating a new ride if passenger does not exist', async () => {
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(new Types.ObjectId().toHexString()));
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
          .send(getRequestRide(passengerId));
        const secondRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        expect(secondRideResponse.statusCode).toBe(409);
      });
    });
    describe('Accept Ride', () => {
      it('POST /v1/request-ride should allow driver accepting ride', async () => {
        const passenger = getPassengerAccount();
        const driver = getDriverAccount();
        const createPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(passenger);
        const createDriverResponse = await request(server)
          .post('/v1/sign-up')
          .send(driver);
        const passengerId = createPassengerResponse.body.id;
        const driverId = createDriverResponse.body.id;
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        const rideId = requestRideResponse.body.id;
        const acceptRideResponse = await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId });
        const getRideResponse = await request(server).get(
          `/v1/rides/${rideId}`,
        );
        expect(acceptRideResponse.statusCode).toBe(201);
        expect(getRideResponse.body).toEqual(
          expect.objectContaining({
            status: 'ACCEPTED',
            driver: expect.objectContaining({ id: driverId }),
          }),
        );
      });
      it(`POST /v1/request-ride should prevent driver from accepting a ride when there's another ongoing ride`, async () => {
        const passenger = getPassengerAccount();
        const otherPassenger = getPassengerAccount();
        const driver = getDriverAccount();
        const createPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(passenger);
        const createOtherPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(otherPassenger);
        const createDriverResponse = await request(server)
          .post('/v1/sign-up')
          .send(driver);
        const passengerId = createPassengerResponse.body.id;
        const otherPassengerId = createOtherPassengerResponse.body.id;
        const driverId = createDriverResponse.body.id;
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        const requestOtherRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(otherPassengerId));
        const rideId = requestRideResponse.body.id;
        const otherRideId = requestOtherRideResponse.body.id;
        await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId });
        const acceptOtherRideResponse = await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId: otherRideId });
        expect(acceptOtherRideResponse.statusCode).toBe(409);
      });
      it('POST /v1/request-ride reject accepting ride if driver does not exist', async () => {
        const passenger = getPassengerAccount();
        const createPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(passenger);
        const passengerId = createPassengerResponse.body.id;
        const driverId = new Types.ObjectId().toHexString();
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        const rideId = requestRideResponse.body.id;
        const acceptRideResponse = await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId });
        expect(acceptRideResponse.statusCode).toBe(422);
      });
      it(`POST /v1/request-ride reject accepting ride if account is not a driver's account`, async () => {
        const passenger = getPassengerAccount();
        const otherPassenger = getPassengerAccount();
        const createPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(passenger);
        const createOtherPassengerResponse = await request(server)
          .post('/v1/sign-up')
          .send(otherPassenger);
        const passengerId = createPassengerResponse.body.id;
        const driverId = createOtherPassengerResponse.body.id;
        const requestRideResponse = await request(server)
          .post('/v1/request-ride')
          .send(getRequestRide(passengerId));
        const rideId = requestRideResponse.body.id;
        const acceptRideResponse = await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId });
        expect(acceptRideResponse.statusCode).toBe(422);
      });
    });
  });
});
