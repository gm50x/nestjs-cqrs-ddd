import { Entity } from '@gedai/core';

export class Payment extends Entity {
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
