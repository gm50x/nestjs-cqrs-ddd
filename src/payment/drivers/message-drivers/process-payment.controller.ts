import { AmqpBindSimpleRetrial, routingKeyOf } from '@gedai/amqp';
import { RideFinishedEvent } from '@gedai/events';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpBindSimpleRetrial({
    exchange: 'events',
    routingKey: routingKeyOf(RideFinishedEvent),
    queue: 'process-payments',
    maxAttempts: 3,
    delayInMillis: 10000,
  })
  async execute(message: any) {
    await this.commandBus.execute(
      new ProcessPaymentCommand({ rideId: message.rideId }),
    );
  }
}
