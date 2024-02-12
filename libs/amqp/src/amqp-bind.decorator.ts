import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Inject, Logger, applyDecorators } from '@nestjs/common';
import { AmqpService } from './amqp.service';

function Retriable(maxAttempts = 3, delayInMillis = 5000) {
  const injectAmqp = Inject(AmqpService);
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    injectAmqp(target, '__amqp');
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        await originalMethod.apply(this, args);
      } catch (error) {
        const [content, message] = args; // The message is the second argument to the method, the content is the first
        const retryCount = message.properties.headers?.retryCount || 0;

        if (retryCount < maxAttempts) {
          Logger.error(
            `Error: ${error.message}, requeueing message. Retry Count: ${
              retryCount + 1
            }`,
          );

          const amqp: AmqpService = this.__amqp;
          await amqp.publish(
            message.fields.exchange,
            message.fields.routingKey,
            content,
            {
              ...message.properties,
              headers: {
                ...message.properties.headers,
                retryCount: retryCount + 1,
                'x-delay': delayInMillis * retryCount,
              },
            },
          );
        } else {
          // TODO: send to dlq
          Logger.error(
            `Maximum retry count reached. Message will be discarded.`,
          );
        }
        throw error;
      }
    };

    return descriptor;
  };
}

type AmqpBindOptions = {
  exchange: string;
  routingKey: string;
  queue: string;
  maxAttempts?: number;
  delayInMillis?: number;
};

export const AmqpBind = ({
  exchange,
  routingKey,
  queue,
  maxAttempts = 3,
  delayInMillis = 5000,
}: AmqpBindOptions) =>
  applyDecorators(
    Retriable(maxAttempts, delayInMillis),
    RabbitSubscribe({
      exchange,
      routingKey,
      queue,
      createQueueIfNotExists: true,
      errorHandler: defaultNackErrorHandler,
    }),
  );
