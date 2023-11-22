import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

@Injectable()
export class AmqpConnection implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(private readonly config: ConfigService) {}

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
    const appName = this.config.getOrThrow('APP_NAME');
    const url = 'amqp://gedai:gedai@localhost:5672';
    // const url = this.config.getOrThrow('AMQP_URL');
    this.connection = amqp.connect(url, {
      heartbeatIntervalInSeconds: 60,
      connectionOptions: { clientProperties: { connection_name: appName } },
    });
    this.channel = this.connection.createChannel({ json: true });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
