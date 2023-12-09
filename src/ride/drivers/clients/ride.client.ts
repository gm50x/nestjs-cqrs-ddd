import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetRideQuery } from '../../application/queries/get-ride.query';
import { GetRideResponse } from '../models/get-ride.model';

@Injectable()
export class RideClient {
  constructor(private readonly queryBus: QueryBus) {}

  async getRide(id: string): Promise<GetRideResponse> {
    return this.queryBus.execute(new GetRideQuery(id));
  }
}
