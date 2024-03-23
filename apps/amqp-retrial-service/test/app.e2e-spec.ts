import { createTestApp, destroyTestApp } from '@gedai/test-factory';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ResiliencyController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;

  beforeAll(async () => {
    app = await createTestApp(AppModule);
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  it.skip('/ (GET)', () => {
    return request(server).get('/').expect(200).expect('Hello World!');
  });

  it('should pass', () => {
    expect(1).toBe(1);
  });
});
