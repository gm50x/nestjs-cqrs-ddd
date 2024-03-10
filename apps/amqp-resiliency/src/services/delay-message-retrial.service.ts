import { AmqpService } from '@gedai/amqp';
import { QueueNames } from '@gedai/amqp/amqp.enums';
import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { ExchangeNames, Suffixes } from '../models/amqp.enums';

/** TODO: THIS SHOULD COME FROM OPTIONS */
const REQUEUE_DELAY_DURATIONS = [
  5000, 5000, 5000, 5000,
  // 5 * 1000, // 5s
  // 30 * 1000, // 30s
  // 60 * 1000, // 1m
  // 5 * 60 * 1000, // 5m
  // 15 * 60 * 1000, // 15m
];

@Injectable()
export class DelayMessageRetrialService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly amqp: AmqpService) {}

  async delayMessage(data: any, message: Message) {
    const rejected = 'rejected';
    const messageFailReason = this.getReason(message);
    const rejectionCount = this.getRejectionCount(message, rejected);
    if (messageFailReason !== rejected || !rejectionCount) {
      this.logger.warn(
        `Acked message with reason ${messageFailReason}. It hasn't been ${rejected}!`,
      );
      return;
    }

    const failDelayIndex = rejectionCount - 1;
    const nextWaitDuration = REQUEUE_DELAY_DURATIONS[failDelayIndex];

    this.logger.log(
      `Received a message with ${rejectionCount} failed attempts`,
    );
    if (!nextWaitDuration) {
      await this.sendMessageToDeadLetterQueue(data, message);
      return;
    }

    await this.amqp.publish(ExchangeNames.Delay, '', data, {
      ...message.properties,
      headers: {
        ...message.properties.headers,
        'x-delay': nextWaitDuration,
      },
    });
    this.logger.log(
      `Message was sent to ${ExchangeNames.Delay} exchange for retrial`,
    );
  }

  async requeueMessage(data: any, message: Message) {
    const originalQueue = this.getOriginalQueue(message);
    if (!originalQueue) {
      this.logger.error(
        `Sending message with no original queue set to ${QueueNames.Dead}`,
      );
      await this.amqp.sendToQueue(QueueNames.Dead, data, message.properties);
      return;
    }
    this.logger.debug(`Sending message to ${originalQueue} for retrial`);
    await this.amqp.sendToQueue(originalQueue, data, message.properties);
    this.logger.log(`Message was sent to ${originalQueue} for retrial`);
  }

  protected async sendMessageToDeadLetterQueue(data: any, message: Message) {
    const originalQueue = this.getOriginalQueue(message);
    const messageDeadLetterQueue = `${originalQueue}${Suffixes.Dead}`;
    try {
      await this.amqp.connection.channel.assertQueue(messageDeadLetterQueue);
      await this.amqp.sendToQueue(
        messageDeadLetterQueue,
        data,
        message.properties,
      );
      this.logger.log(`Message was sent to ${messageDeadLetterQueue}`);
    } catch (err) {
      this.logger.error(`Message was sent to ${QueueNames.Dead}`);
      await this.amqp.sendToQueue(QueueNames.Dead, data, message.properties);
    }
  }

  protected getOriginalQueue(message: Message) {
    return message.properties.headers['x-first-death-queue'];
  }

  protected getReason(message: Message) {
    return message.properties.headers['x-first-death-reason'];
  }

  protected getRejectionCount(message: Message, reason: string) {
    const deaths = message.properties.headers['x-death'];
    return deaths.find((d) => d.reason === reason)?.count;
  }
}
