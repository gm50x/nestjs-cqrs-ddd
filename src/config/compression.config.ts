import { INestApplication, Logger } from '@nestjs/common';
import * as compression from 'compression';

export const configureCompression = (app: INestApplication) => {
  app.use(compression());
  Logger.log('Compression initialized', 'Configuration');
  return app;
};
