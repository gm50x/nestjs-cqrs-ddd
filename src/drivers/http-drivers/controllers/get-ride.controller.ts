import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetRideQuery } from '../../../application/commands/get-ride.query';
import { GetRideResponse } from '../models/get-ride.model';

@Controller({ version: '1' })
export class GetRideController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('rides/:id')
  async execute(@Param('id') rideId: string): Promise<GetRideResponse> {
    return await this.queryBus.execute(new GetRideQuery(rideId));
  }
}
