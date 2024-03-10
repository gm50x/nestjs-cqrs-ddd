import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';

type AmqpBindOptions = {
  exchange: string;
  routingKey: string;
  queue: string;
};

export const AmqpBind = ({ exchange, routingKey, queue }: AmqpBindOptions) =>
  applyDecorators(
    RabbitSubscribe({
      exchange,
      routingKey,
      queue,
      createQueueIfNotExists: true,
      queueOptions: { deadLetterExchange: 'error' },
      errorHandler: defaultNackErrorHandler,
    }),
  );
