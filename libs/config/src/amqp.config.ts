import { AmqpModuleOptions, AmqpOptionsFactory } from '@gedai/amqp';
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
        name: exchangeEventRoot,
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
