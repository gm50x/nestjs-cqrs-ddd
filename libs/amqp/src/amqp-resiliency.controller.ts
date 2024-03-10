import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { QueueNames } from './amqp.enums';
import { RetrialStrategy } from './strategies/retrial.strategy';

@Controller()
export class AmqpResiliencyController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly retrialStrategy: RetrialStrategy) {}

  @RabbitSubscribe({ queue: QueueNames.Error, createQueueIfNotExists: false })
  async onErrorDelayMessage(data: any, message: Message) {
    await this.retrialStrategy.delayMessage(data, message);
  }
  @RabbitSubscribe({ queue: QueueNames.Requeue, createQueueIfNotExists: false })
  async onDelayedRequeueMessage(data: any, message: Message) {
    await this.retrialStrategy.requeueMessage(data, message);
  }
}
