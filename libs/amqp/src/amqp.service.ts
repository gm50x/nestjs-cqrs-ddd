import { TracingService } from '@gedai/tracing';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AmqpService {
  constructor(
    private readonly amqp: AmqpConnection,
    private readonly tracingService: TracingService,
  ) {}

  async publish(
    exchange: string,
    routingKey: string,
    content: unknown,
    headers?: Record<string, string | boolean | number>,
  ) {
    const traceId = this.tracingService.get('traceId');
    await this.amqp.publish(exchange, routingKey, content, {
      headers: {
        ...headers,
        'x-trace-id': traceId,
      },
      messageId: randomUUID(),
    });
  }

  // async sendToQueue(
  //   queue: string,
  //   content: unknown,
  //   headers?: Record<string, string | boolean | number>,
  // ) {
  //   await this.amqp.sendToQueue(queue, content, headers);
  // }
}
