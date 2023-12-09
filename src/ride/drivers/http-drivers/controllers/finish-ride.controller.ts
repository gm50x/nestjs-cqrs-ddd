import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FinishRideCommand } from '../../../../ride/application/commands/finish-ride.command';
import { FinishRideRequest } from '../../models/finish-ride.model';

@Controller({ version: '1' })
export class FinishRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('finish-ride')
  async execute(@Body() data: FinishRideRequest): Promise<void> {
    await this.commandBus.execute(new FinishRideCommand(data.rideId));
  }
}
