import { Bind } from '@gedai/amqp-resiliency';
import { routingKeyOf } from '@gedai/amqp/amqp-event-name.adapter';
import { RideFinishedEvent } from '@gedai/events';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Bind({
    exchange: 'events',
    routingKey: routingKeyOf(RideFinishedEvent),
    queue: 'process-payments',
    servicePrefix: 'gummy.bear',
  })
  async execute(message: any) {
    await this.commandBus.execute(
      new ProcessPaymentCommand({ rideId: message.rideId }),
    );
  }
}
