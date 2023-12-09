import { DomainEvent } from '../domain-event';

export class RideRequestedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
