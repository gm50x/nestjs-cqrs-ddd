import { Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from 'amqplib';
import { ExchangeNames, QueueNames } from '../amqp.enums';
import { RetrialStrategy } from './retrial.strategy';

@Injectable()
export class DelayedMessageStrategy
  extends RetrialStrategy
  implements OnModuleInit
{
  async onModuleInit() {
    this.logger.debug('Resiliency is setting up...');
    const { channel } = this.connection;
    /* TODO: this setup should come from options with a base name per service/context */
    await Promise.all([
      channel.assertExchange(ExchangeNames.Error, 'fanout'),
      channel.assertExchange(ExchangeNames.Delay, 'x-delayed-message', {
        arguments: { 'x-delayed-type': 'fanout' },
      }),
      channel.assertQueue(QueueNames.Error),
      channel.assertQueue(QueueNames.Requeue),
    ]);

    await Promise.all([
      channel.bindQueue(QueueNames.Error, ExchangeNames.Error, ''),
      channel.bindQueue(QueueNames.Requeue, ExchangeNames.Delay, ''),
    ]);

    this.logger.log('Resiliency was setup');
  }

  async delayMessage(data: any, message: Message) {
    const reason = this.getReason(message);
    const rejectionReason = 'rejected';
    if (reason !== rejectionReason) {
      this.logger.warn(`NOT REJECTION ${reason}`);
      // ACK Message (not nacked)
      return;
    }
    const rejectionCount = this.getRejectionCount(message, rejectionReason);
    if (rejectionCount <= 0) {
      this.logger.warn(`NOT REJECTION ${reason}`);
      // ACK Message (not nacked)
      return;
    }
    /** TODO: THIS SHOULD COME FROM OPTIONS */
    const REQUEUE_DELAY_DURATIONS = [
      10000, 10000, 10000, 10000, 10000,
      // 5 * 1000, // 5s
      // 30 * 1000, // 30s
      // 60 * 1000, // 1m
      // 5 * 60 * 1000, // 5m
      // 15 * 60 * 1000, // 15m
    ];
    const attemptCount = rejectionCount - 1;
    const nextWaitDuration = REQUEUE_DELAY_DURATIONS[attemptCount];
    this.logger.log(
      `---- GOT A MESSAGE IN ERROR QUEUE ${attemptCount} ${nextWaitDuration} ----`,
    );
    if (!nextWaitDuration) {
      await this.sendToDeadLetterQueue(data, message);
      return;
    }

    await this.amqp.publish(ExchangeNames.Delay, '', data, {
      ...message.properties,
      headers: {
        ...message.properties.headers,
        'x-delay': nextWaitDuration,
      },
    });
  }
}
