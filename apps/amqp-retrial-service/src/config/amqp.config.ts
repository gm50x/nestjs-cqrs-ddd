import { AmqpModuleOptions, AmqpOptionsFactory } from '@gedai/amqp';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChannelNames, ExchangeNames, QueueNames } from '../models/amqp.enums';

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
      channels: [
        { name: ChannelNames.Publisher, default: true },
        { name: ChannelNames.ErrorConsumer, prefetchCount: 25 },
        { name: ChannelNames.RequeueConsumer, prefetchCount: 25 },
      ],
    };
  }
}
