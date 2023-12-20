import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetRideOutput } from '../../../application/models/get-ride.model';
import {
  GetRideQuery,
  GetRideResult,
} from '../../../application/queries/get-ride.query';

@Controller({ version: '1' })
export class GetRideController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('rides/:id')
  async execute(@Param('id') rideId: string): Promise<GetRideOutput> {
    const result = await this.queryBus.execute<GetRideQuery, GetRideResult>(
      new GetRideQuery({ rideId }),
    );
    return result.data;
  }
}
