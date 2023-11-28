import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

export type AmqpConnectionOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  enableEventPropagation?: boolean;
};

@Injectable()
export class AmqpConnection implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(
    @Inject('AMQP_OPTIONS') private readonly opts: AmqpConnectionOptions,
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
    this.channel = this.connection.createChannel({ json: true });
    await this.channel.assertExchange('events', 'topic');
    await this.channel.assertQueue('events-log');
    await this.channel.bindQueue('events-log', 'events', '#');
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
