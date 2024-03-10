import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { Suffixes } from '../amqp.enums';
import { AmqpService } from '../amqp.service';

@Injectable()
export abstract class RetrialStrategy {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly amqp: AmqpService,
    protected readonly connection: AmqpConnection,
  ) {}

  protected async sendToDeadLetterQueue(data: any, message: Message) {
    const originalQueue = this.getOriginalQueue(message);
    const deadLetterQueue = `${originalQueue}${Suffixes.Dead}`;
    await this.connection.channel.assertQueue(deadLetterQueue);
    await this.amqp.sendToQueue(deadLetterQueue, data, message.properties);
  }

  protected getOriginalQueue(message: Message) {
    return message.properties.headers['x-first-death-queue'];
  }

  protected getReason(message: Message) {
    return message.properties.headers['x-first-death-reason'];
  }

  protected getRejectionCount(message: Message, reason: string) {
    const deaths = message.properties.headers['x-death'];
    return deaths.find((d) => d.reason === reason)?.count ?? -1;
  }

  abstract delayMessage(data: any, message: Message): Promise<void>;
  async requeueMessage(data: any, message: Message) {
    const originalQueue = this.getOriginalQueue(message);
    if (!originalQueue) {
      // ACK - Not Rejected Message
      return;
    }
    this.logger.debug(
      `--- SENDING BACK TO ORIGINAL QUEUE ${originalQueue} ---`,
    );
    await this.amqp.sendToQueue(
      originalQueue,
      message.content,
      message.properties,
    );
    this.logger.log(
      `--- MESSAGE WAS SENT BACK TO ORIGINAL QUEUE ${originalQueue} ---`,
    );
  }
}
