import { INestApplication, Logger, VersioningType } from '@nestjs/common';

export const configureVersioning = (app: INestApplication) => {
  app.enableVersioning({ type: VersioningType.URI });
  Logger.log('API Versioning initialized', 'Configuration');
  return app;
};
