import { HttpServer, INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection as MongooseConnection, Types } from 'mongoose';
import * as request from 'supertest';
import { getDriverAccount, getPassengerAccount } from './stubs/accounts';
import { getRequestRide, getRidePositions } from './stubs/rides';
import { createTestApp } from './utils/configure-test-app';

describe('Rides (Integration Specs)', () => {
  let app: INestApplication;
  let server: HttpServer;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
  });

  beforeEach(() => {
    server = app.getHttpServer();
  });

  afterAll(async () => {
    const mongooseConnection =
      app.get<MongooseConnection>(getConnectionToken());
    await mongooseConnection.dropDatabase();
    await app.close();
  });

  describe('POST /v1/request-ride', () => {
    it('should create a new ride for passenger and return the ride id', async () => {
      const passenger = getPassengerAccount();
      const createPassengerResponse = await request(server)
        .post('/v1/sign-up')
        .send(passenger);
      const passengerId = createPassengerResponse.body.id;
      const requestRideResponse = await request(server)
        .post('/v1/request-ride')
        .send(getRequestRide(passengerId));
      const rideId = requestRideResponse.body.id;
      const getRideResponse = await request(server).get(`/v1/rides/${rideId}`);
      expect(requestRideResponse.statusCode).toBe(201);
      expect(rideId).toEqual(expect.any(String));
      expect(getRideResponse.body).toEqual(
        expect.objectContaining({
          status: 'REQUESTED',
          passenger: expect.objectContaining({ id: passengerId }),
        }),
      );
    });
    it('should fail creating a new ride if passenger does not exist', async () => {
      const requestRideResponse = await request(server)
        .post('/v1/request-ride')
        .send(getRequestRide(new Types.ObjectId().toHexString()));
      expect(requestRideResponse.statusCode).toBe(422);
    });
    it('should fail creating a new ride if passenger already has an active ride', async () => {
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
  describe('POST /v1/accept-ride', () => {
    it('should allow driver accepting ride', async () => {
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
      const getRideResponse = await request(server).get(`/v1/rides/${rideId}`);
      expect(acceptRideResponse.statusCode).toBe(201);
      expect(getRideResponse.body).toEqual(
        expect.objectContaining({
          status: 'ACCEPTED',
          driver: expect.objectContaining({ id: driverId }),
        }),
      );
    });
    it(`should prevent driver from accepting a ride when there's another ongoing ride`, async () => {
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
      await request(server).post('/v1/accept-ride').send({ driverId, rideId });
      const acceptOtherRideResponse = await request(server)
        .post('/v1/accept-ride')
        .send({ driverId, rideId: otherRideId });
      expect(acceptOtherRideResponse.statusCode).toBe(409);
    });
    it('should reject accepting ride if driver does not exist', async () => {
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
    it(`should reject accepting ride if account is not a driver's account`, async () => {
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
  describe('POST /v1/start-ride', () => {
    it('should start the ride', async () => {
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
      await request(server).post('/v1/accept-ride').send({ driverId, rideId });
      const startRideResponse = await request(server)
        .post('/v1/start-ride')
        .send({ rideId });
      const getRideResponse = await request(server).get(`/v1/rides/${rideId}`);
      expect(startRideResponse.statusCode).toBe(201);
      expect(getRideResponse.body).toEqual(
        expect.objectContaining({
          status: 'IN_PROGRESS',
        }),
      );
    });
    it('should fail starting non existing rides', async () => {
      const startRideResponse = await request(server)
        .post('/v1/start-ride')
        .send({ rideId: new Types.ObjectId().toHexString() });
      expect(startRideResponse.statusCode).toBe(422);
    });
  });
  describe('POST /v1/update-position', () => {
    it(`should update the ride's position`, async () => {
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
      await request(server).post('/v1/accept-ride').send({ driverId, rideId });
      await request(server).post('/v1/start-ride').send({ rideId });
      const updatePositionResponse = await request(server)
        .post('/v1/update-position')
        .send(getRidePositions(rideId).data.at(1));
      expect(updatePositionResponse.statusCode).toBe(201);
    });
    it('should fail starting non existing rides', async () => {
      const startRideResponse = await request(server)
        .post('/v1/update-position')
        .send({ rideId: new Types.ObjectId().toHexString() });
      expect(startRideResponse.statusCode).toBe(422);
    });
  });
  describe('POST /v1/finish-ride', () => {
    it('should finish the ride', async () => {
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
      await request(server).post('/v1/accept-ride').send({ driverId, rideId });
      await request(server).post('/v1/start-ride').send({ rideId });
      const positions = getRidePositions(rideId).data;
      for (const position of positions) {
        await request(server).post('/v1/update-position').send(position);
      }
      const finishRideResponse = await request(server)
        .post('/v1/finish-ride')
        .send({ rideId });
      const getRideResponse = await request(server).get(`/v1/rides/${rideId}`);
      expect(finishRideResponse.statusCode).toBe(201);
      expect(getRideResponse.body).toEqual(
        expect.objectContaining({
          status: 'FINISHED',
          distance: expect.closeTo(0.7455),
          fare: expect.closeTo(15.6572),
        }),
      );
    });
    it('should fail finishing non existing rides', async () => {
      const startRideResponse = await request(server)
        .post('/v1/finish-ride')
        .send({ rideId: new Types.ObjectId().toHexString() });
      expect(startRideResponse.statusCode).toBe(422);
    });
  });
});
