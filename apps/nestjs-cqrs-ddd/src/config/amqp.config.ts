import { AmqpModuleOptions, AmqpOptionsFactory } from '@gedai/nestjs-amqp';
import {
  AmqpPublisherContextModuleOptions,
  AmqpPublisherContextOptionsFactory,
} from '@gedai/nestjs-tactical-design-amqp';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmqpConfig implements AmqpOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createAmqpOptions(): AmqpModuleOptions {
    const [appName, url, exchangeEventRoot] = [
      this.config.getOrThrow('APP_NAME'),
      this.config.getOrThrow('AMQP_URL'),
      this.config.getOrThrow('AMQP_EXCHANGE_EVENT_ROOT'),
    ];
    return {
      url,
      appName,
      exchanges: [
        // ::StyleKeep::
        { name: exchangeEventRoot },
      ],
    };
  }
}

@Injectable()
export class AmqpPublisherConfig implements AmqpPublisherContextOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createAmqpPublisherOptions(): AmqpPublisherContextModuleOptions {
    const eventBusName = this.config.getOrThrow<string>(
      'AMQP_EXCHANGE_EVENT_ROOT',
    );
    return { eventBusName };
  }
}
