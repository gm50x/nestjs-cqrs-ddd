import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FinishRideCommand } from '../../../../ride/application/commands/finish-ride.command';
import { FinishRideInput } from '../../../application/dtos/finish-ride.dto';

@Controller({ version: '1' })
export class FinishRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('finish-ride')
  async execute(@Body() data: FinishRideInput): Promise<void> {
    await this.commandBus.execute(new FinishRideCommand(data));
  }
}
