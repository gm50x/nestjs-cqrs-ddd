import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AcceptRideCommand } from '../../../../ride/application/commands/accept-ride.command';
import { AcceptRideRequest } from '../../models/accept-ride.model';

@Controller({ version: '1' })
export class AcceptRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('accept-ride')
  async execute(@Body() data: AcceptRideRequest): Promise<void> {
    await this.commandBus.execute(
      new AcceptRideCommand(data.driverId, data.rideId),
    );
  }
}