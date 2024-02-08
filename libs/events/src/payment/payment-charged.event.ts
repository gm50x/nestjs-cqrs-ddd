import { DomainEvent } from '@gedai/tactical-domain';

export class PaymentChargedEvent extends DomainEvent {
  constructor(
    readonly rideId: string,
    readonly passengerEmail: string,
    readonly driverEmail: string,
    readonly amount: number,
    readonly date: Date,
  ) {
    super();
  }
}
