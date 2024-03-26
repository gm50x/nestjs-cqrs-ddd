import {
  RabbitHeader,
  RabbitPayload,
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common';
import { Channel } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';

type AmqpSubscribeOptions = {
  exchange: string;
  routingKey: string;
  queue: string;
  channel?: string;
  deadLetterExchange?: string;
  enableValidation?: boolean;
};

const deadLetterErrorHandler = (
  channel: Channel,
  message: ConsumeMessage,
  error: any,
  originalQueue: string,
) => {
  const defaultExchange = '';
  const deadLetterQueue = `${originalQueue}.dead`;
  channel.assertQueue(deadLetterQueue);
  channel.publish(defaultExchange, deadLetterQueue, message.content, {
    ...message.properties,
    headers: {
      ...message.properties.headers,
      'x-dead-letter-reason': error,
    },
  });
  channel.ack(message, false);
};

export const AmqpSubscribe = ({
  exchange,
  routingKey,
  queue,
  channel,
  deadLetterExchange,
  enableValidation,
}: AmqpSubscribeOptions) => {
  const decorators = [
    RabbitSubscribe({
      exchange,
      routingKey,
      queue,
      createQueueIfNotExists: true,
      queueOptions: {
        deadLetterExchange,
        channel,
      },
      // errorHandler: defaultNackErrorHandler,
      errorHandler: (channel, message, error) => {
        if (error instanceof BadRequestException) {
          return deadLetterErrorHandler(channel, message, error, queue);
        }
        return defaultNackErrorHandler(channel, message, error);
      },
    }),
  ];
  if (enableValidation !== false) {
    decorators.push(UsePipes(ValidationPipe));
  }
  return applyDecorators(...decorators);
};

export const AmqpPayload = RabbitPayload;
export const AmqpHeaders = RabbitHeader;
