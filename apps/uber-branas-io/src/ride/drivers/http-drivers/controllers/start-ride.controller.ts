import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StartRideCommand } from '../../../application/commands/start-ride.command';
import { StartRideInput } from '../../../application/dtos/start-ride.dto';

@Controller({ version: '1' })
export class StartRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('start-ride')
  async execute(@Body() data: StartRideInput): Promise<void> {
    await this.commandBus.execute(new StartRideCommand(data));
  }
}
