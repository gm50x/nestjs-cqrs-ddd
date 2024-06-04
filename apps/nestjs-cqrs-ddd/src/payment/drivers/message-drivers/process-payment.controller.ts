import { AmqpPayload, AmqpSubscription } from '@gedai/nestjs-amqp';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';
import { ProcessPaymentInput } from '../../application/dtos/process-payment.dto';

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpSubscription({
    exchange: 'events',
    routingKey: 'ride.finished', //TODO: routingKeyOf(RideFinishedEvent),
    queue: 'process-payments',
  })
  async execute(@AmqpPayload() message: ProcessPaymentInput) {
    await this.commandBus.execute(new ProcessPaymentCommand(message));
  }
}
