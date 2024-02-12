import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';

export type BindingOptions = {
  exchange: string;
  queue: string;
  servicePrefix?: string;
  routingKey?: string;
};

export const Bind = ({
  exchange,
  queue,
  routingKey = '',
  servicePrefix,
}: BindingOptions) =>
  RabbitSubscribe({
    exchange,
    routingKey,
    queue,
    createQueueIfNotExists: true,
    errorHandler: defaultNackErrorHandler,
    queueOptions: {
      deadLetterRoutingKey: `${routingKey}.rejected`,
      deadLetterExchange: servicePrefix
        ? `${servicePrefix}.resiliency.dlx`
        : 'resiliency.dlx',
    },
  });
