import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';

export const configureValidation = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  Logger.log('Validation initialized', 'Configuration');
  return app;
};
