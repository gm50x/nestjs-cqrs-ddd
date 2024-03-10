import {
  MessageErrorHandler,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { setTimeout } from 'timers/promises';
import { ExchangeNames, QueueNames } from '../../models/amqp.enums';
import { DelayMessageRetrialService } from '../../services/delay-message-retrial.service';

const errorHandler: MessageErrorHandler = async (channel, message, error) => {
  Logger.error({
    message: 'Failed handling message with error',
    error,
  });
  await setTimeout(5000);
  channel.nack(message, false, true);
  Logger.log({
    message: 'Message was requeued to the head',
    error,
  });
};

@Controller()
export class AmqpResiliencyController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly retrialService: DelayMessageRetrialService) {}

  @RabbitSubscribe({
    exchange: ExchangeNames.Error,
    queue: QueueNames.Error,
    routingKey: '',
    errorHandler,
  })
  async onErrorDelayMessage(data: any, message: Message) {
    await this.retrialService.delayMessage(data, message);
  }

  @RabbitSubscribe({
    exchange: ExchangeNames.Delay,
    queue: QueueNames.Requeue,
    routingKey: '',
    errorHandler,
  })
  async onDelayedRequeueMessage(data: any, message: Message) {
    await this.retrialService.requeueMessage(data, message);
  }
}
