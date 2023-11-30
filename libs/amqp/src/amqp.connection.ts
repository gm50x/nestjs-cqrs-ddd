import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, {
  AmqpConnectionManager,
  Channel,
  ChannelWrapper,
} from 'amqp-connection-manager';

import { AmqpModuleOptions, MODULE_OPTIONS_TOKEN } from './amqp.options';

@Injectable()
export class AmqpConnection implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly opts: AmqpModuleOptions,
  ) {}

  async sendToQueue(
    queue: string,
    content: unknown,
    headers: Record<string, string | boolean | number>,
  ) {
    const result = await this.channel.sendToQueue(queue, content, { headers });
    if (!result) {
      throw new Error('Failed sending message to queue');
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: unknown,
    headers?: Record<string, string | boolean | number>,
  ) {
    const result = await this.channel.publish(exchange, routingKey, content, {
      headers,
    });
    if (!result) {
      throw new Error('Failed publishing message to exchange');
    }
  }

  async onModuleInit() {
    const { url, appName, heartbeatIntervalInSeconds = 60 } = this.opts || {};
    this.connection = amqp.connect(url, {
      heartbeatIntervalInSeconds,
      connectionOptions: { clientProperties: { connection_name: appName } },
    });
    this.channel = this.connection.createChannel({
      json: true,
      async setup(channel: Channel) {
        await channel.assertExchange('events', 'topic');
        await channel.assertQueue('events-log');
        await channel.bindQueue('events-log', 'events', '#');
      },
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
