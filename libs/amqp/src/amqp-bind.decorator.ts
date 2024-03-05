import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Inject, Logger, applyDecorators } from '@nestjs/common';
import { AmqpService } from './amqp.service';

// TODO: make this work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const attemptCount = message.properties.headers?.attemptCount || 1;

        if (attemptCount < maxAttempts) {
          Logger.error(
            `Error: ${error.message}, requeueing message. Attempt Count: ${attemptCount}`,
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
                attemptCount: attemptCount + 1,
                'x-delay': delayInMillis * attemptCount,
              },
            },
          );
        } else {
          // TODO: send to dlq
          Logger.error(
            `Maximum attempt count reached. Message will be discarded.`,
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
    // Retriable(maxAttempts, delayInMillis),
    RabbitSubscribe({
      exchange,
      routingKey,
      queue,
      createQueueIfNotExists: true,
      errorHandler: defaultNackErrorHandler,
    }),
  );
