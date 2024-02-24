import { GetRideInput, GetRideOutput } from '../dtos/get-ride.dto';

export class GetRideQuery {
  constructor(readonly data: GetRideInput) {}
}

export class GetRideResult {
  constructor(readonly data: GetRideOutput) {}
}
