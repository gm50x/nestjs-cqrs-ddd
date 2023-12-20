import {
  RequestRideInput,
  RequestRideOutput,
} from '../models/request-ride.model';

export class RequestRideCommand {
  constructor(readonly data: RequestRideInput) {}
}

export class RequestRideResult {
  constructor(readonly data: RequestRideOutput) {}
}
