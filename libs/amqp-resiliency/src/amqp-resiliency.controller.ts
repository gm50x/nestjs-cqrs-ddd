import { Controller } from '@nestjs/common';
import { Message } from 'amqplib';
import { Bind } from './amqp-bind.decorator';
import { AmqpResiliencyService } from './amqp-resiliency.service';

export function AmqpResiliencyController(servicePrefix = '') {
  const dlxExchangeName = 'resiliency.dlx';
  const delayedExchangeName = 'resiliency.delayed';

  const errorQueueName = 'resiliency.error';
  const retryRouterQueueName = 'resiliency.retry.router';

  const dlx = servicePrefix
    ? `${servicePrefix}.${dlxExchangeName}`
    : dlxExchangeName;
  const delayedExchange = servicePrefix
    ? `${servicePrefix}.${delayedExchangeName}`
    : delayedExchangeName;

  const errorQueue = servicePrefix
    ? `${servicePrefix}.${errorQueueName}`
    : errorQueueName;
  const retryRouterQueue = servicePrefix
    ? `${servicePrefix}.${retryRouterQueueName}`
    : retryRouterQueueName;

  @Controller()
  class AmqpResiliencyControllerHost {
    constructor(readonly service: AmqpResiliencyService) {}

    logThis(logLine: string, message: any, rawMessage: Message) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...messageProperties } = rawMessage;
      const stringify = (x: any) => JSON.stringify(x, null, 2);
      console.log(
        '-'.repeat(100),
        logLine,
        stringify({ message, messageProperties }),
      );
    }

    @Bind({
      servicePrefix,
      exchange: dlx,
      queue: errorQueue,
      routingKey: '#.rejected',
    })
    async onNack(message: any, rawMessage: Message) {
      await this.service.handleNackedMessages(message, rawMessage);
    }

    @Bind({
      servicePrefix,
      exchange: delayedExchange,
      queue: retryRouterQueue,
      routingKey: '#.scheduled',
    })
    async onSchedule(message: any, rawMessage: Message) {
      await this.service.handleDelayedMessages(message, rawMessage);
    }
  }

  return AmqpResiliencyControllerHost;
}
