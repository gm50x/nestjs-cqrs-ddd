import { AmqpService } from '@gedai/amqp';
import { Inject, Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import {
  AmqpResiliencyModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './amqp-resiliency.options';

@Injectable()
export class AmqpResiliencyService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: AmqpResiliencyModuleOptions,
    private readonly amqp: AmqpService,
  ) {}

  async handleNackedMessages(content: any, rawMessage: Message) {
    const { maxAttempts, servicePrefix, timeBetweenRetrials } = this.options;

    const exchange = servicePrefix
      ? `${servicePrefix}.resiliency.delayed`
      : 'resiliency.delayed';

    const xDeathCount =
      rawMessage.properties.headers['x-death'].find(
        (x) => x.reason === 'rejected',
      ).count ?? 1;

    const isDead = xDeathCount > maxAttempts;

    const routingKeySufix = isDead ? 'dead' : 'scheduled';
    const routingKey = `${rawMessage.fields.routingKey.replace(
      '.rejected',
      '',
    )}.${routingKeySufix}`;

    if (isDead) {
      // TODO: send to dlq
    }

    const calculatedDelayTime = xDeathCount * timeBetweenRetrials;
    const { maxTimeBetweenRetrials = calculatedDelayTime } = this.options;
    const xDelay =
      calculatedDelayTime <= maxTimeBetweenRetrials
        ? calculatedDelayTime
        : maxTimeBetweenRetrials;

    rawMessage.properties.headers['x-delay'] = xDelay;
    await this.amqp.publish(
      exchange,
      routingKey,
      content,
      rawMessage.properties,
    );
  }

  async handleDelayedMessages(content: any, rawMessage: Message) {
    const originalQueue = rawMessage.properties.headers['x-first-death-queue'];
    // TODO: if none throw? ignore?
    await this.amqp.sendToQueue(originalQueue, content, rawMessage.properties);
  }
}
