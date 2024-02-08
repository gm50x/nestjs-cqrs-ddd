import { ContextService } from '@gedai/async-context';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type Headers = Record<string, string | boolean | number>;

@Injectable()
export class AmqpService {
  constructor(
    private readonly amqp: AmqpConnection,
    private readonly contextService: ContextService,
  ) {}

  private factoryHeaders(headers?: Headers) {
    const traceId = this.contextService.get('traceId');
    return {
      ...(headers ?? {}),
      'x-trace-id': traceId,
    };
  }

  private factoryMessageId() {
    return randomUUID();
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: object,
    headers?: Headers,
  ) {
    await this.amqp.publish(exchange, routingKey, content, {
      headers: this.factoryHeaders(headers),
      messageId: this.factoryMessageId(),
    });
  }

  async sendToQueue(
    queue: string,
    content: object,
    headers?: Record<string, string | boolean | number>,
  ) {
    await this.amqp.managedChannel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(content)),
      {
        headers: this.factoryHeaders(headers),
        messageId: this.factoryMessageId(),
      },
    );
  }
}
