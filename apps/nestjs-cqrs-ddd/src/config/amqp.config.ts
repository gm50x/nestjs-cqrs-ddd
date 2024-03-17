import {
  AmqpModuleOptions,
  AmqpOptionsFactory,
  toDottedNotation,
} from '@gedai/amqp';
import {
  AmqpPublisherContextModuleOptions,
  AmqpPublisherContextOptionsFactory,
} from '@gedai/tactical-design-amqp';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmqpConfig implements AmqpOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createAmqpOptions(): AmqpModuleOptions {
    const [appName, url, exchangeEventRoot] = [
      this.config.get('APP_NAME'),
      this.config.getOrThrow('AMQP_URL'),
      this.config.get('AMQP_EXCHANGE_EVENT_ROOT'),
    ];
    const exchanges: RabbitMQExchangeConfig[] = [];
    if (exchangeEventRoot) {
      exchanges.push({
        createExchangeIfNotExists: true,
        name: toDottedNotation(exchangeEventRoot),
        type: 'topic',
      });
    }
    return {
      url,
      appName,
      exchanges,
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
