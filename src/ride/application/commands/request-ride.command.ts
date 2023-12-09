import { Coord } from '../abstractions/ride.factory';

export class RequestRideCommand {
  constructor(
    readonly passengerId: string,
    readonly from: Coord,
    readonly to: Coord,
  ) {}
}

export class RequestRideResult {
  constructor(readonly id: string) {}
}
