import {
  configureCORS,
  configureCompression,
  configureExceptionsHandler,
  configureHelmet,
  configureLogger,
  configureOpenAPI,
  configureRoutePrefix,
  configureValidation,
  configureVersioning,
} from '@gedai/config';
import { HttpServer, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';
import { AppModule } from '../src/app.module';

describe('Payment (Integration Specs)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    configureRoutePrefix(app);

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

  describe('Payment', () => {
    describe('onRideFinished', () => {
      it.todo(
        'should charge passenger' /* async () => {
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
});
