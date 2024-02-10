import { IntegrationEvent } from '@gedai/tactical-domain';

export class PaymentChargedEvent extends IntegrationEvent {
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
