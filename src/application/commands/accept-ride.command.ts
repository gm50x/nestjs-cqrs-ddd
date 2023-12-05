export class AcceptRideCommand {
  constructor(
    readonly driverId: string,
    readonly rideId: string,
  ) {}
}
