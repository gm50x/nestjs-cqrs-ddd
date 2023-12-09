import { DomainEvent } from '../domain-event';

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
