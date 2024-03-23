import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';

type AmqpBindOptions = {
  exchange: string;
  routingKey: string;
  queue: string;
  channel?: string;
  deadLetterExchange?: string;
};

export const AmqpBind = ({
  exchange,
  routingKey,
  queue,
  channel,
  deadLetterExchange,
}: AmqpBindOptions) =>
  applyDecorators(
    RabbitSubscribe({
      exchange,
      routingKey,
      queue,
      createQueueIfNotExists: true,
      queueOptions: {
        deadLetterExchange,
        channel,
      },
      errorHandler: defaultNackErrorHandler,
    }),
  );
