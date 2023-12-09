import { AggregateRoot } from '@nestjs/cqrs';

export class Payment extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly rideId: string,
    readonly passengerId: string,
    readonly driverId: string,
    readonly amount: number,
    readonly distance: number,
    readonly passengerEmail: string,
    readonly driverEmail: string,
    readonly rideDate: Date,
  ) {
    super();
  }
}
