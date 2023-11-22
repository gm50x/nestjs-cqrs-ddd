import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureOpenAPI = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const [env, title, description, version] = [
    configService.get('NODE_ENV', 'development'),
    configService.get('APP_NAME', 'dummy-world-service'),
    configService.get('APP_DESCRIPTION', 'Dummy World Service'),
    configService.get('APP_VERSION', '1.0.0'),
  ];

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(`${version}-${env}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  Logger.log('Open API initialized', 'Configuration');
  return app;
};
