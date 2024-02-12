import { ContextifyService } from '@gedai/contextify';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { MessageProperties } from 'amqplib';
import { randomUUID } from 'crypto';

@Injectable()
export class AmqpService {
  constructor(
    private readonly amqp: AmqpConnection,
    private readonly contextService: ContextifyService,
  ) {}

  private factoryHeaders(headers?: MessageProperties['headers']) {
    const traceId = this.contextService.get('traceId');
    return {
      ...(headers ?? {}),
      'x-trace-id': traceId,
    };
  }

  private factoryMessageId(id: any) {
    return id ?? randomUUID();
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: object,
    properties?: MessageProperties,
  ) {
    await this.amqp.publish(exchange, routingKey, content, {
      ...properties,
      headers: this.factoryHeaders(properties.headers),
      messageId: this.factoryMessageId(properties.messageId),
    });
  }

  async sendToQueue(
    queue: string,
    content: object,
    properties?: MessageProperties,
  ) {
    await this.amqp.managedChannel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(content)),
      {
        ...properties,
        headers: this.factoryHeaders(properties.headers),
        messageId: this.factoryMessageId(properties.messageId),
      },
    );
  }
}
