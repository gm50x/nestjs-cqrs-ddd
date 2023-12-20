import { GetRideInput, GetRideOutput } from '../models/get-ride.model';

export class GetRideQuery {
  constructor(readonly data: GetRideInput) {}
}

export class GetRideResult {
  constructor(readonly data: GetRideOutput) {}
}
