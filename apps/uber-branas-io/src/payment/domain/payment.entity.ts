import { Entity } from '@gedai/nestjs-tactical-design';

export class Payment extends Entity {
  constructor(
    readonly _id: string,
    readonly rideId: string,
    readonly passengerId: string,
    readonly driverId: string,
    readonly amount: number,
    readonly distance: number,
    readonly passengerEmail: string,
    readonly driverEmail: string,
    readonly rideDate: Date,
  ) {
    super(_id);
  }
}
