import { routingKeyOf } from '@gedai/amqp/amqp-event-name.adapter';
import { RideFinishedEvent } from '@gedai/events';
import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

const Bind = (exchange: string, routingKey: string, queue: string) =>
  RabbitSubscribe({
    exchange,
    routingKey,
    queue,
    createQueueIfNotExists: true,
    errorHandler: defaultNackErrorHandler,
    // queueOptions: {
    //   deadLetterExchange: 'payments.dlx',
    //   deadLetterRoutingKey: `${AmqpEventNameAdapter.getRoutingKey(
    //     RideFinishedEvent,
    //   )}`,
    // },
  });

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Bind('events', routingKeyOf(RideFinishedEvent), 'process-payments')
  async execute(message: any) {
    await this.commandBus.execute(
      new ProcessPaymentCommand({ rideId: message.rideId }),
    );
  }
}
