import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePositionCommand } from '../../../application/commands/update-position.command';
import { UpdatePositionRequest } from '../models/update-position.model';

@Controller({ version: '1' })
export class UpdatePositionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('update-position')
  async execute(@Body() data: UpdatePositionRequest): Promise<void> {
    await this.commandBus.execute(
      new UpdatePositionCommand(data.rideId, data.coord),
    );
  }
}
