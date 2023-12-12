import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const configureRoutePrefix = (app: INestApplication) => {
  const config = app.get(ConfigService);
  const prefix = config.get('ROUTE_PREFIX', '').trim();
  app.setGlobalPrefix(prefix);
  Logger.log('Route Prefixes Initialized', 'Configuration');
  return app;
};
