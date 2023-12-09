import { Coord } from '../abstractions/ride.factory';

export class UpdatePositionCommand {
  constructor(
    readonly rideId: string,
    readonly coord: Coord,
  ) {}
}
