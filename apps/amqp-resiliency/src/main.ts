import {
  configureAmqpAuditInterceptor,
  configureContextInterceptor,
  configureExceptionsHandler,
  configureLogger,
} from '@gedai/config';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
    .then(configureLogger)
    .then(configureExceptionsHandler)
    .then(configureContextInterceptor)
    .then(configureAmqpAuditInterceptor);

  const config = app.get(ConfigService);
  const port = config.get('PORT', '3001');

  await app.listen(port, async () => {
    Logger.log(`Application listening on ${await app.getUrl()}`, 'Startup');
  });
}
bootstrap();
