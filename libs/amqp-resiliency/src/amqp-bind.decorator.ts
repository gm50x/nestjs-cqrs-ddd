import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';

type BindingOptions = {
  exchange: string;
  routingKey: string;
  queue: string;
};

export const Bind = ({ exchange, queue, routingKey }: BindingOptions) =>
  RabbitSubscribe({
    exchange,
    routingKey,
    queue,
    createQueueIfNotExists: true,
    errorHandler: defaultNackErrorHandler,
    queueOptions: {
      deadLetterExchange: 'resiliency.dlx',
    },
    // queueOptions: {
    //   deadLetterExchange: 'payments.dlx',
    //   deadLetterRoutingKey: `${AmqpEventNameAdapter.getRoutingKey(
    //     RideFinishedEvent,
    //   )}`,
    // },
  });
