import { AmqpBind, routingKeyOf } from '@gedai/amqp';
import { RideFinishedEvent } from '@gedai/strategic-design';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpBind({
    exchange: 'events',
    routingKey: routingKeyOf(RideFinishedEvent),
    queue: 'process-payments',
  })
  async execute(message: any) {
    await this.commandBus.execute(
      new ProcessPaymentCommand({ rideId: message.rideId }),
    );
  }
}
