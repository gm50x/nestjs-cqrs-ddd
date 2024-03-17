import { INestApplication, Logger } from '@nestjs/common';
import helmet from 'helmet';

export const configureHelmet = (app: INestApplication) => {
  app.use(helmet());
  Logger.log('Server security initialized', 'Configuration');
  return app;
};
