import { AmqpBind, AmqpPayload, routingKeyOf } from '@gedai/amqp';
import { RideFinishedEvent } from '@gedai/strategic-design';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from '../../application/commands/process-payment.command';
import { ProcessPaymentInput } from '../../application/dtos/process-payment.dto';

@Controller()
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpBind({
    exchange: 'events',
    routingKey: routingKeyOf(RideFinishedEvent),
    queue: 'process-payments',
    deadLetterExchange: 'error',
  })
  async execute(@AmqpPayload() message: ProcessPaymentInput) {
    await this.commandBus.execute(new ProcessPaymentCommand(message));
  }
}
