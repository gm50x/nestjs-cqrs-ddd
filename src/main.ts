import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  configureCORS,
  configureCompression,
  configureExceptionsHandler,
  configureHelmet,
  configureLogger,
  configureOpenAPI,
  configureValidation,
} from './config';
import { configureVersioning } from './config/versioning.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
    .then(configureLogger)
    .then(configureCORS)
    .then(configureCompression)
    .then(configureExceptionsHandler)
    .then(configureHelmet)
    .then(configureOpenAPI)
    .then(configureValidation)
    .then(configureVersioning);

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');

  await app.listen(port, async () => {
    Logger.log(`Application listening on ${await app.getUrl()}`, 'Startup');
  });
}
bootstrap();
