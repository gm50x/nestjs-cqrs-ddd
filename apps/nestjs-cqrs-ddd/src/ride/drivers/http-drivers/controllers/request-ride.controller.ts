import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RequestRideCommand,
  RequestRideResult,
} from '../../../application/commands/request-ride.command';
import {
  RequestRideInput,
  RequestRideOutput,
} from '../../../application/dtos/request-ride.dto';

@Controller({ version: '1' })
export class RequestRideController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('request-ride')
  async execute(@Body() data: RequestRideInput): Promise<RequestRideOutput> {
    const result = await this.commandBus.execute<
      RequestRideCommand,
      RequestRideResult
    >(new RequestRideCommand(data));
    return result.data;
  }
}
