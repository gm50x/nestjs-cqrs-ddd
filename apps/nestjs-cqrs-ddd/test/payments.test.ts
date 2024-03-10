import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setTimeout } from 'timers/promises';
import { getDriverAccount, getPassengerAccount } from './stubs/accounts';
import { getRequestRide, getRidePositions } from './stubs/rides';
import { createTestApp, destroyTestApp } from './utils/configure-test-app';

describe('Payment (Integration Specs)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let server: HttpServer;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  describe('onRideFinished', () => {
    it.todo(
      'should process payment' /* async () => {
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
        await request(server)
          .post('/v1/accept-ride')
          .send({ driverId, rideId });
        await request(server).post('/v1/start-ride').send({ rideId });
        const positions = getRidePositions(rideId).data;
        for (const position of positions) {
          await request(server).post('/v1/update-position').send(position);
        }
        await request(server).post('/v1/finish-ride').send({ rideId });
        await setTimeout(1000);

        expect(1).toBe(1);
      }*/,
    );

    it('should process payment', async () => {
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
      await setTimeout(2500);
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
    it.todo(
      'should do something magical',
      /*async () => {
          const startRideResponse = await request(server)
            .post('/v1/finish-ride')
            .send({ rideId: new Types.ObjectId().toHexString() });
          expect(startRideResponse.statusCode).toBe(422);
        },*/
    );
  });
});
