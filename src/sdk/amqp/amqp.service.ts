import { Injectable } from '@nestjs/common';
import { AmqpConnection } from './amqp.connection';

@Injectable()
export class AmqpService {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(
    exchange: string,
    routingKey: string,
    content: unknown,
    headers?: Record<string, string | boolean | number>,
  ) {
    await this.amqp.publish(exchange, routingKey, content, headers);
  }

  async sendToQueue(
    queue: string,
    content: unknown,
    headers?: Record<string, string | boolean | number>,
  ) {
    await this.amqp.sendToQueue(queue, content, headers);
  }
}
