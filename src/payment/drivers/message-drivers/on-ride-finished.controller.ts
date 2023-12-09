import { AmqpEventNameAdapter } from '@gedai/amqp/amqp-event-name.adapter';
import { RideFinishedEvent } from '@gedai/core';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

@Controller()
export class OnRideFinishedController {
  constructor(private readonly commandBus: CommandBus) {}
  @RabbitSubscribe({
    exchange: 'events',
    routingKey: AmqpEventNameAdapter.getRoutingKey(RideFinishedEvent),
    queue: 'process-payments',
    createQueueIfNotExists: true,
    // queueOptions: {
    //   deadLetterExchange: 'payments.dlx',
    //   deadLetterRoutingKey: `${AmqpEventNameAdapter.getRoutingKey(
    //     RideFinishedEvent,
    //   )}`,
    // },
  })
  async execute(message: any) {
    try {
      await this.commandBus.execute(new ProcessPaymentCommand(message.rideId));
    } catch (err) {
      console.log(err);
      return new Nack();
    }
  }
}
