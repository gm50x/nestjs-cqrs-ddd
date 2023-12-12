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
import { INestApplication } from '@nestjs/common';

export function configureTestApp(app: INestApplication, silentLogger = true) {
  configureLogger(app, silentLogger);
  configureCORS(app);
  configureCompression(app);
  configureExceptionsHandler(app);
  configureHelmet(app);
  configureOpenAPI(app);
  configureValidation(app);
  configureVersioning(app);
  configureRoutePrefix(app);
  return app;
}
