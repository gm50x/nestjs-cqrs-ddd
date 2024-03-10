import { AmqpModuleOptions, AmqpOptionsFactory } from '@gedai/amqp';
import { ExchangeNames, QueueNames } from '@gedai/amqp/amqp.enums';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmqpConfig implements AmqpOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createAmqpOptions(): AmqpModuleOptions | Promise<AmqpModuleOptions> {
    const [appName, url] = [
      this.config.get('APP_NAME', 'amqp-resiliency'),
      this.config.getOrThrow('AMQP_URL'),
    ];

    return {
      url,
      appName,
      exchanges: [
        {
          name: ExchangeNames.Error,
          type: 'fanout',
        },
        {
          name: ExchangeNames.Delay,
          type: 'x-delayed-message',
          options: { arguments: { 'x-delayed-type': 'fanout' } },
        },
      ],
      queues: [
        {
          name: QueueNames.Dead,
        },
      ],
    };
  }
}
