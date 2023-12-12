import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

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
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
    .then(configureLogger)
    .then(configureCORS)
    .then(configureCompression)
    .then(configureExceptionsHandler)
    .then(configureHelmet)
    .then(configureOpenAPI)
    .then(configureValidation)
    .then(configureVersioning)
    .then(configureRoutePrefix);

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');

  await app.listen(port, async () => {
    Logger.log(`Application listening on ${await app.getUrl()}`, 'Startup');
  });
}
bootstrap();
