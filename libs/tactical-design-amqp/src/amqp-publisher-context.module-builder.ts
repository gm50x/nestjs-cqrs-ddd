import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AmqpPublisherContext } from './amqp-publisher-context';
import { getPublisherToken } from './amqp-publisher-context.token';
import {
  AmqpPublisherContextModuleExtraOptions,
  AmqpPublisherContextModuleOptions,
} from './amqp-publisher.factory';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpPublisherContextModuleOptions>()
    .setClassMethodName('forFeature')
    .setFactoryMethodName('createAmqpPublisherOptions')
    .setExtras<AmqpPublisherContextModuleExtraOptions>(
      null,
      (definitions, extras) => {
        const PublisherToken = getPublisherToken(extras.publisherName);
        return {
          ...definitions,
          providers: [
            ...(definitions.providers || []),
            {
              provide: PublisherToken,
              useClass: AmqpPublisherContext,
            },
          ],
          exports: [...(definitions.exports || []), PublisherToken],
          global: true,
        };
      },
    )
    .build();
