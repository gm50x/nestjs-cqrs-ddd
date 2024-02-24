import { RequestRideInput, RequestRideOutput } from '../dtos/request-ride.dto';

export class RequestRideCommand {
  constructor(readonly data: RequestRideInput) {}
}

export class RequestRideResult {
  constructor(readonly data: RequestRideOutput) {}
}
