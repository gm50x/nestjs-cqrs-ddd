import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RequestRideCommand } from '../../../../ride/application/commands/request-ride.command';
import {
  RequestRideRequest,
  RequestRideResponse,
} from '../models/request-ride.model';

@Controller({ version: '1' })
export class RequestRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('request-ride')
  async execute(
    @Body() data: RequestRideRequest,
  ): Promise<RequestRideResponse> {
    return await this.commandBus.execute(
      new RequestRideCommand(data.passengerId, data.from, data.to),
    );
  }
}
